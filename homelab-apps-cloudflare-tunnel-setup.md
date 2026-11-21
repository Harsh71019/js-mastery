# Exposing 5 Personal Apps via Cloudflare Tunnel + Access

## Context (read this first)

- **Server:** Proxmox homelab (Acer Aspire 5), apps run in LXC containers
- **Existing infra:** NPMplus (reverse proxy) + CrowdSec already running, AdGuard Home for local DNS
- **Apps to expose (all Node.js + MongoDB, all single-user/personal):**
  1. DSA75 — LeetCode/DSA tracker
  2. Task manager
  3. Expense tracker (⚠️ receives data from n8n email-parsing workflow — see Step 7)
  4. Book reader/tracker
  5. App #5 (fill in name + port)
- **Goal:** All 5 apps reachable on subdomains of my domain, protected so ONLY I can access them. No code changes to apps. No MongoDB changes. No open router ports (ISP may be CGNAT).
- **Chosen approach:** Cloudflare Tunnel (`cloudflared`) + Cloudflare Access (Zero Trust). Free tier covers everything.

**Architecture:**
```
Internet → Cloudflare edge (Access auth happens HERE)
        → Tunnel (outbound-only connection from my server)
        → cloudflared LXC
        → NPMplus (optional, keeps single routing layer)  OR  directly → app LXC ip:port
```

---

## Step 1: Move domain DNS to Cloudflare

1. Create free Cloudflare account → **Add a Site** → enter domain → pick **Free plan**
2. Cloudflare scans existing DNS records — review, keep what's needed (MX records if email is on the domain!)
3. Cloudflare gives 2 nameservers → go to domain registrar → replace nameservers with Cloudflare's
4. Wait for propagation (minutes to a few hours). Cloudflare emails when active.

> Domain stays registered where it is. Only nameservers change.

## Step 2: Create the cloudflared LXC

On Proxmox, create a minimal LXC (Debian 12, 1 vCPU, 256–512 MB RAM, 2 GB disk is plenty). Then inside it:

```bash
# Install cloudflared (Debian/Ubuntu)
curl -fsSL https://pkg.cloudflare.com/cloudflare-main.gpg | sudo tee /usr/share/keyrings/cloudflare-main.gpg >/dev/null
echo "deb [signed-by=/usr/share/keyrings/cloudflare-main.gpg] https://pkg.cloudflare.com/cloudflared any main" | sudo tee /etc/apt/sources.list.d/cloudflared.list
sudo apt update && sudo apt install cloudflared -y
```

Alternative: the community Proxmox helper script for cloudflared, or run it as a Docker container if a Docker LXC already exists. Either is fine — one cloudflared instance handles all 5 apps.

## Step 3: Create the tunnel (dashboard method — easiest)

1. Cloudflare dashboard → **Zero Trust** (one.dash.cloudflare.com) → free plan signup if prompted
2. **Networks → Tunnels → Create a tunnel** → type: **Cloudflared** → name it (e.g. `homelab`)
3. Cloudflare shows an install/run command with a token, like:
   ```bash
   sudo cloudflared service install <TOKEN>
   ```
4. Run that inside the LXC. Tunnel should show **HEALTHY** in the dashboard.

The connection is **outbound only** — no port forwarding on the router, works behind CGNAT.

## Step 4: Map subdomains to apps (Public Hostnames)

In the tunnel's config → **Public Hostname** tab → add one entry per app:

| Subdomain | Service (internal) |
|---|---|
| `dsa.DOMAIN.com` | `http://<LXC-IP>:<PORT>` |
| `tasks.DOMAIN.com` | `http://<LXC-IP>:<PORT>` |
| `expenses.DOMAIN.com` | `http://<LXC-IP>:<PORT>` |
| `books.DOMAIN.com` | `http://<LXC-IP>:<PORT>` |
| `app5.DOMAIN.com` | `http://<LXC-IP>:<PORT>` |

Two routing choices:
- **Direct:** point each hostname straight at the app's LXC IP:port (simplest)
- **Via NPMplus:** point all hostnames at NPMplus (`http://<npmplus-ip>:80`) and let NPMplus route by host header — keeps existing proxy setup as the single routing layer. If NPMplus expects HTTPS with its own certs, use `https://<npmplus-ip>:443` and enable **No TLS Verify** in the hostname's TLS settings (self-signed internal cert is fine here).

Cloudflare auto-creates the DNS records for each hostname. TLS to the browser is automatic.

## Step 5: Lock everything down with Cloudflare Access

Without this step the apps are PUBLIC. Do not skip.

1. Zero Trust dashboard → **Access → Applications → Add an application** → **Self-hosted**
2. Application domain: can add **multiple domains in one app** — add all 5 subdomains (or use a wildcard `*.DOMAIN.com` if everything on the domain should be gated)
3. Session duration: set to something convenient, e.g. **1 week** (re-auth weekly on phone is tolerable)
4. Create a policy:
   - Name: `only-me`
   - Action: **Allow**
   - Include → **Emails** → my personal email address
5. Login methods: default **One-time PIN** (email OTP) works with zero setup. Optionally add **Google** as an identity provider (Settings → Authentication → Login methods) for one-tap login on phone.

Result: visiting any subdomain → Cloudflare login page → email OTP or Google → app loads. Strangers/bots never reach the server.

## Step 6: Verify

- [ ] Each subdomain loads over HTTPS from mobile data (not home Wi-Fi) — proves tunnel works externally
- [ ] Opening in incognito prompts Cloudflare Access login
- [ ] Wrong email gets denied
- [ ] `cloudflared` service survives LXC reboot: `systemctl status cloudflared`
- [ ] Router has NO new port forwards (there shouldn't be any)

## Step 7: ⚠️ n8n → expense tracker (machine-to-machine traffic)

The n8n workflow that parses bank emails and POSTs to the expense tracker will be **blocked by Cloudflare Access** if it calls the public URL (it can't do an interactive login).

**Fix — pick one:**
- **Option A (recommended, simplest):** keep n8n → expense-tracker traffic on the LAN. n8n should call the internal IP (`http://<lxc-ip>:<port>/api/...`), never the public subdomain. Since both are inside the homelab, nothing changes. Just verify the n8n workflow's URL.
- **Option B:** Cloudflare Access **Service Token** — create in Zero Trust → Access → Service Auth, add a policy allowing the token on `expenses.DOMAIN.com` (or just the `/api/webhook` path via a separate Access application), then set headers `CF-Access-Client-Id` and `CF-Access-Client-Secret` in n8n's HTTP request node.

## Step 8: Optional hardening

- In Cloudflare **SSL/TLS** settings, set mode to **Full** (or Full (strict) if using valid certs internally via NPMplus)
- Zero Trust → Settings → block countries other than India on the Access policy (minor, Access already blocks strangers)
- Keep Vaultwarden / Proxmox UI / AdGuard **off** the tunnel — those stay LAN/Tailscale only
- `cloudflared` updates: `apt upgrade` periodically, or enable unattended-upgrades in the LXC

## Troubleshooting quick refs

- Tunnel shows unhealthy → `journalctl -u cloudflared -f` in the LXC
- 502 from Cloudflare → hostname's service IP/port wrong, or app LXC firewall blocking the cloudflared LXC
- Redirect loops with NPMplus → set the app's NPMplus host to plain HTTP internally, let Cloudflare own TLS
- Access login loop on phone → clear cookies for the subdomain, check session duration setting

---

**Info to fill in before starting:** domain name, each app's LXC IP + port, personal email for the Access policy, whether routing goes direct or through NPMplus.

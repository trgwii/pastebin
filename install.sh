useradd -rm pastebin
cat << EOF > /etc/systemd/system/pastebin.service
[Unit]
Description=Pastebin Server
After=network.target

[Service]
Type=simple
User=pastebin
WorkingDirectory=/home/pastebin
ExecStart=deno run --allow-net --allow-read=pastes --allow-write=pastes https://git.rory.no/trgwii/pastebin/raw/branch/master/serve.ts 8080 127.0.0.1
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOF
systemctl enable pastebin
systemctl start pastebin

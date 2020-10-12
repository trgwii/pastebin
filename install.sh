useradd -s /bin/bash -rm pastebin
su pastebin -c "curl -fsSL https://deno.land/x/install/install.sh | sh"
su pastebin -c "echo 'export DENO_INSTALL=\"/home/pastebin/.deno\"' >> ~/.bash_profile"
su pastebin -c "echo 'export PATH=\"\$DENO_INSTALL/bin:\$PATH\"' >> ~/.bash_profile"
su pastebin -c ". ~/.bash_profile; deno cache --reload https://git.rory.no/trgwii/pastebin/raw/branch/master/serve.ts"
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

sudo apt install openvpn -y

wget -O minivpn.zip http://silema.hiterp.com/instalador/minivpn.zip
unzip -o minivpn.zip -d ~/temporalVPN/
sudo cp -a ~/temporalVPN/1/. /etc/openvpn/client/

sudo systemctl start openvpn-client@client
sudo systemctl start openvpn-client@client7
sudo systemctl enable openvpn-client@client
sudo systemctl enable openvpn-client@client7

sudo apt install openssh-server

sudo cp -f ~/temporalVPN/1/sshd_config /etc/ssh/
sudo cp -f ~/temporalVPN/3/authorized_keys ~/.ssh/

sudo systemctl restart ssh
sudo apt install tigervnc-scraping-server -y
sudo apt install x11vnc -y
sudo apt install tigervnc-common -y
vncpasswd
cp -f ~/temporalVPN/2/.xprofile ~/

sudo iptables -A INPUT -p tcp --dport 5900:5901 ! -i tun+ -j DROP
sudo apt install iptables-persistent
sudo netfilter-persistent save
sudo nano /etc/gdm3/custom.conf
sudo nano /etc/ssh/sshd_config
rm -rf ~/temporalVPN
clear
echo "Recuerda cambiar el certificado y la key en /etc/openvpn/client/ (REQUIERE REINICIO)"
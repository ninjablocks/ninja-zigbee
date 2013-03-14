## Requirements
1. Beaglebone
2. TI CC2531 USB dongle programmed as a ZigBee Network Processor
3. TI Zlight (ZigBee Light).

## Setup instructions

### Burn Ninja Image
```
https://s3.amazonaws.com/ninjablocks/images/beagle/titanium.img.zip
```

### Upgrade node to v0.8.x
```
cd /tmp
wget https://s3.amazonaws.com/ninjablocks/binaries/beagle/node-v0.8.17.tgz
tar -zxvf node-v0.8.17.tgz 
sudo mv node /usr/bin/
sudo ln -s /usr/bin/node /usr/bin/nodejs
sudo add-apt-repository ppa:chris-lea/node.js
sudo apt-get update
sudo apt-get install npm
```

### Setup Necessary Shared Libs
```
sudo apt-get install libc6-armel-cross
sudo ln -sf /usr/arm-linux-gnueabi/lib/ld-linux.so.3 /lib/ld-linux.so.3
sudo ln -sf /usr/arm-linux-gnueabi/lib/libc.so.6 /lib/libc.so.6
```

### Clone client and install module
```
cd /opt
sudo rm -rf ninja
sudo git clone https://github.com/ninjablocks/client.git ninja
sudo chown -R ubuntu ninja
cd ninja
git checkout develop
./bin/install.sh
```

### Clone module

```
git clone https://github.com/ninjablocks/client-zigbee /opt/ninja/modules/ZigbeeLL
```

### Start client
```
export NODE_ENV=hacking
node client.js
```

### Pair with Ninja Cloud

Enter the serial number given in the console log
```
https://a.ninja.is/born
```

### SSH into block
It should appear as ninjablock.local, alternatively screen will do the job


### Restart process

```
sudo service ninjablock restart 
tail -f /var/log/ninjablock.log
```

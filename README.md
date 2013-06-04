## Requirements
1. Beaglebone
2. TI CC2531 USB dongle programmed as a ZigBee Network Processor
3. TI Zlight (ZigBee Light).

## Setup instructions

### Burn Ninja Image
```
https://s3.amazonaws.com/ninjablocks/images/beagle/palladium.img.zip
```

### Clone module

```
git clone -b zigbee-lighting https://github.com/ninjablocks/ninja-zigbee /opt/ninja/drivers/ninja-zigbee
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

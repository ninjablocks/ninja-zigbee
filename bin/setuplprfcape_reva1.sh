# PAD CONTROL registers (/sys/kernel/debug/omap_mux) :
# | 7 | 6                    | 5                     | 4                    | 3                    | 2 | 1 | 0 |
# | x | SLEW Fast(0)/Slow(1) | RXACTIVE Off(0)/On(1) | PULLTYPE Dn(0)/Up(1) | PULLENA On(0)/Off(1) | MODE      |


echo "Configuring P8 Pins"
echo .

#P8.3 - EM1_RSTn - GPIO1_6 - GPIO1_6 - mode GPIO (7)
echo 0x3f > /sys/kernel/debug/omap_mux/gpmc_ad6
cat /sys/kernel/debug/omap_mux/gpmc_ad6
echo 38 > /sys/class/gpio/unexport
echo 38 > /sys/class/gpio/export

#P8.4 - EM2_RSTn - GPIO1_7 - GPIO1_7 - mode GPIO (7)
echo 0x3f > /sys/kernel/debug/omap_mux/gpmc_ad7
cat /sys/kernel/debug/omap_mux/gpmc_ad7
echo 39 > /sys/class/gpio/unexport
echo 39 > /sys/class/gpio/export

#P8.7 - EM1_GPIO0 - TIMER4  - GPIO2_2 - mode GPIO (7)
echo 0x3f > /sys/kernel/debug/omap_mux/gpmc_advn_ale
cat /sys/kernel/debug/omap_mux/gpmc_advn_ale
echo 66 > /sys/class/gpio/unexport
echo 66 > /sys/class/gpio/export

#P8.8 - EM2_GPIO0 - TIMER7  - GPIO2_3 - mode GPIO (7)
echo 0x3f > /sys/kernel/debug/omap_mux/gpmc_oen_ren
cat /sys/kernel/debug/omap_mux/gpmc_oen_ren
echo 67 > /sys/class/gpio/unexport
echo 67 > /sys/class/gpio/export

#P8.9 - EM1_GPIO1 - TIMER5  - GPIO2_5 - mode GPIO (7)
echo 0x3f > /sys/kernel/debug/omap_mux/gpmc_ben0_cle
cat /sys/kernel/debug/omap_mux/gpmc_ben0_cle
echo 69 > /sys/class/gpio/unexport
echo 69 > /sys/class/gpio/export

#P8.10 - EM2_GPIO1 - TIMER6  - GPIO2_4 - mode GPIO (7)
echo 0x3f > /sys/kernel/debug/omap_mux/gpmc_wen
cat /sys/kernel/debug/omap_mux/gpmc_wen
echo 68 > /sys/class/gpio/unexport
echo 68 > /sys/class/gpio/export

#P8.11 - EM1_GPIO2 - GPIO_1_13  - GPIO1_13 - mode GPIO (7)
echo 0x3f > /sys/kernel/debug/omap_mux/gpmc_ad13
cat /sys/kernel/debug/omap_mux/gpmc_ad13
echo 45 > /sys/class/gpio/unexport
echo 45 > /sys/class/gpio/export

#P8.12 - EM2_GPIO2 - GPIO1_12  - GPIO1_12 - mode GPIO (7)
echo 0x3f > /sys/kernel/debug/omap_mux/gpmc_ad12
cat /sys/kernel/debug/omap_mux/gpmc_ad12
echo 44 > /sys/class/gpio/unexport
echo 44 > /sys/class/gpio/export

#P8.13 - EM1_GPIO3 - EHRPWM2B  - GPIO0_23 - mode GPIO (7)
echo 0x3f > /sys/kernel/debug/omap_mux/gpmc_ad9
cat /sys/kernel/debug/omap_mux/gpmc_ad9
echo 23 > /sys/class/gpio/unexport
echo 23 > /sys/class/gpio/export

#P8.14 - EM2_GPIO3 - GPIO0_26  - GPIO0_26 - mode GPIO (7)
echo 0x3f > /sys/kernel/debug/omap_mux/gpmc_ad10
cat /sys/kernel/debug/omap_mux/gpmc_ad10
echo 26 > /sys/class/gpio/unexport
echo 26 > /sys/class/gpio/export

#P8.15 - EM1_GPIO4 - GPIO1_15  - GPIO1_15 - mode GPIO (7)
echo 0x3f > /sys/kernel/debug/omap_mux/gpmc_ad15
cat /sys/kernel/debug/omap_mux/gpmc_ad15
echo 47 > /sys/class/gpio/unexport
echo 47 > /sys/class/gpio/export

#P8.16 - EM2_GPIO4 - GPIO1_14  - GPIO1_14 - mode GPIO (7)
echo 0x3f > /sys/kernel/debug/omap_mux/gpmc_ad14
cat /sys/kernel/debug/omap_mux/gpmc_ad14
echo 46 > /sys/class/gpio/unexport
echo 46 > /sys/class/gpio/export

#P8.17 - EM1_GPIO5 - GPIO0_27  - GPIO0_27 - mode GPIO (7)
echo 0x3f > /sys/kernel/debug/omap_mux/gpmc_ad11
cat /sys/kernel/debug/omap_mux/gpmc_ad11
echo 27 > /sys/class/gpio/unexport
echo 27 > /sys/class/gpio/export

#P8.18 - EM2_GPIO5 - GPIO2_1  - GPIO2_1 - mode GPIO (7)
echo 0x3f > /sys/kernel/debug/omap_mux/gpmc_clk
cat /sys/kernel/debug/omap_mux/gpmc_clk
echo 65 > /sys/class/gpio/unexport
echo 65 > /sys/class/gpio/export

#P8.21 - EM1_SPI_ENA - GPIO1_30  - GPIO1_30 - mode GPIO (7)
echo 0x3f > /sys/kernel/debug/omap_mux/gpmc_csn1
cat /sys/kernel/debug/omap_mux/gpmc_csn1
echo 62 > /sys/class/gpio/unexport
echo 62 > /sys/class/gpio/export

#P8.22 - EM2_SPI_ENA - GPIO1_5  - GPIO1_5 - mode GPIO (7)
echo 0x3f > /sys/kernel/debug/omap_mux/gpmc_ad5
cat /sys/kernel/debug/omap_mux/gpmc_ad5
echo 37 > /sys/class/gpio/unexport
echo 37 > /sys/class/gpio/export

#P8.23 - EM1_LED - GPIO1_4  - GPIO1_4 - mode GPIO (7)
echo 0x3f > /sys/kernel/debug/omap_mux/gpmc_ad4
cat /sys/kernel/debug/omap_mux/gpmc_ad4
echo 36 > /sys/class/gpio/unexport
echo 36 > /sys/class/gpio/export

#P8.24 - EM2_LED - GPIO1_1  - GPIO1_1 - mode GPIO (7)
echo 0x3f > /sys/kernel/debug/omap_mux/gpmc_ad1
cat /sys/kernel/debug/omap_mux/gpmc_ad1
echo 33 > /sys/class/gpio/unexport
echo 33 > /sys/class/gpio/export

#P8.25 - EM1_PBUTTON - GPIO1_0  - GPIO1_0 - mode GPIO (7)
echo 0x3f > /sys/kernel/debug/omap_mux/gpmc_ad0
cat /sys/kernel/debug/omap_mux/gpmc_ad0
echo 32 > /sys/class/gpio/unexport
echo 32 > /sys/class/gpio/export

#P8.26 - EM2_PBUTTON - GPIO1_29  - GPIO1_29 - mode GPIO (7)
echo 0x3f > /sys/kernel/debug/omap_mux/gpmc_csn0
cat /sys/kernel/debug/omap_mux/gpmc_csn0
echo 61 > /sys/class/gpio/unexport
echo 61 > /sys/class/gpio/export

#P8.31 - EM1_UART_CTSn - UART5_CTSN  - UART5_CTSN - mode UART (6)
#echo 0x76 > /sys/kernel/debug/omap_mux/lcd_data14
#P8.31 - EM1_UART_CTSn - GPIO0_10  - GPIO0_10 - mode GPIO (7)
echo 0x3f > /sys/kernel/debug/omap_mux/lcd_data14
cat /sys/kernel/debug/omap_mux/lcd_data14
echo 10 > /sys/class/gpio/unexport
echo 10 > /sys/class/gpio/export

#P8.32 - EM1_UART_RTSn - UART5_RTSN  - UART5_RTSN - mode UART (6)
#echo 0x36 > /sys/kernel/debug/omap_mux/lcd_data15
#P8.32 - EM1_UART_RTSn - GPIO0_11  - GPIO0_11 - mode GPIO (7) === SRDY EM1
echo 0x3f > /sys/kernel/debug/omap_mux/lcd_data15
cat /sys/kernel/debug/omap_mux/lcd_data15
echo 11 > /sys/class/gpio/unexport
echo 11 > /sys/class/gpio/export

#P8.33 - EM2_UART_RTSn - UART4_RTSN - UART4_RTSN - mode UART (6)
#echo 0x06 > /sys/kernel/debug/omap_mux/lcd_data13
#P8.33 - EM2_UART_RTSn - UART4_RTSN - GPIO0_9 - mode GPIO (7) === SRDY EM2
echo 0x3f > /sys/kernel/debug/omap_mux/lcd_data13
cat /sys/kernel/debug/omap_mux/lcd_data13
echo 9 > /sys/class/gpio/unexport
echo 9 > /sys/class/gpio/export

#P8.35 - EM2_UART_CTSn - UART4_CTSN  - UART4_CTSN - mode UART (6)
#echo 0x36 > /sys/kernel/debug/omap_mux/lcd_data12
#P8.35 - EM2_UART_CTSn - UART4_CTSN  - GPIO0_8 - mode GPIO (7)
echo 0x3f > /sys/kernel/debug/omap_mux/lcd_data12
cat /sys/kernel/debug/omap_mux/lcd_data12
echo 8 > /sys/class/gpio/unexport
echo 8 > /sys/class/gpio/export

#P8.37 - EM1_UART_TX_a - UART5_TXD  - UART5_TXD - mode UART (4)
echo 0x04 > /sys/kernel/debug/omap_mux/lcd_data8
#P8.37 - EM1_UART_TX_a - UART5_TXD  - GPIO2_14 - mode GPIO (7)
#echo 0x3f > /sys/kernel/debug/omap_mux/lcd_data8
cat /sys/kernel/debug/omap_mux/lcd_data8
echo 78 > /sys/class/gpio/unexport
echo 78 > /sys/class/gpio/export

#P8.38 - EM1_UART_RX_a - UART5_RXD  - UART5_RXD - mode UART (4)
echo 0x34 > /sys/kernel/debug/omap_mux/lcd_data9
#P8.38 - EM1_UART_RX_a - UART5_RXD  - GPIO2_15 - mode GPIO (7)
#echo 0x3f > /sys/kernel/debug/omap_mux/lcd_data9
cat /sys/kernel/debug/omap_mux/lcd_data9
echo 79 > /sys/class/gpio/unexport
echo 79 > /sys/class/gpio/export

echo "Configuring P9 Pins"
echo .

#P9.11 - EM2_UART_RX - UART4_RXD  - UART4_RXD - mode UART (6)
echo 0x36 > /sys/kernel/debug/omap_mux/gpmc_wait0
#P9.11 - EM2_UART_RX - UART4_TXD  - GPIO0_30 - mode GPIO (7)
#echo 0x3f > /sys/kernel/debug/omap_mux/gpmc_wait0
cat /sys/kernel/debug/omap_mux/gpmc_wait0
echo 30 > /sys/class/gpio/unexport
echo 30 > /sys/class/gpio/export

#P9.13 - EM2_UART_TX - UART4_TXD  - UART4_TXD - mode UART (6)
echo 0x06 > /sys/kernel/debug/omap_mux/gpmc_wpn
#P9.13 - EM2_UART_TX - UART4_TXD  - GPIO0_31 - mode GPIO (7)
#echo 0x3f > /sys/kernel/debug/omap_mux/gpmc_wpn
cat /sys/kernel/debug/omap_mux/gpmc_wpn
echo 31 > /sys/class/gpio/unexport
echo 31 > /sys/class/gpio/export

#P9.17 - EMx_I2C_SCL - I2C1_SCL  - I2C1_SCL - mode I2C (2)
#P9.18 - EMx_I2C_SDA - I2C1_SDA  - I2C1_SDA - mode I2C (2)
#P9.19 - Cape EEPROM - I2C2_SCL  - I2C2_SCL - mode I2C (2)
#P9.20 - Cape EEPROM - I2C2_SDA  - I2C2_SDA - mode I2C (2)

#P9.24 - EM1_UART_TX_b - UART1_TXD  - UART1_TXD - mode UART (6)
#echo 0x34 > /sys/kernel/debug/omap_mux/uart1_txd
#P9.24 - EM1_UART_TX_b - UART1_TXD  - GPIO0_15 - mode GPIO (7)
echo 0x3f > /sys/kernel/debug/omap_mux/uart1_txd
cat /sys/kernel/debug/omap_mux/uart1_txd
echo 15 > /sys/class/gpio/unexport
echo 15 > /sys/class/gpio/export

#P9.26 - EM1_UART_RX_b - UART1_RXD  - UART1_RXD - mode UART (6)
#echo 0x36 > /sys/kernel/debug/omap_mux/uart1_rxd
#P9.26 - EM1_UART_RX_b - UART1_RXD  - GPIO0_14 - mode GPIO (7)
echo 0x3f > /sys/kernel/debug/omap_mux/uart1_rxd
cat /sys/kernel/debug/omap_mux/uart1_rxd
echo 14 > /sys/class/gpio/unexport
echo 14 > /sys/class/gpio/export

if [ $1 == "spi" ]; then
#P9.28 - EMx_SPI_CSn - SPI1_CS0  - SPI1_CS0 - mode SPI (3)
echo 0x33 > /sys/kernel/debug/omap_mux/mcasp0_ahclkr
else
#P9.28 - EMx_SPI_CSn - SPI1_CS0  - GPIO3_17 - mode GPIO (7)
echo 0x3f > /sys/kernel/debug/omap_mux/mcasp0_ahclkr
echo 113 > /sys/class/gpio/unexport
echo 113 > /sys/class/gpio/export
fi
cat /sys/kernel/debug/omap_mux/mcasp0_ahclkr

if [ $1 == "spi" ]; then
#D0 - this is spi data 'input' (note swapped) (receiver must be enabled)
#P9.29 - EMx_SPI_MISO - SPI1_D0  - SPI1_D0 - mode SPI (3)
echo 0x33 > /sys/kernel/debug/omap_mux/mcasp0_fsx
else
#P9.29 - EMx_SPI_MISO - SPI1_D0  - GPIO3_15 - mode GPIO (7)
echo 0x3f > /sys/kernel/debug/omap_mux/mcasp0_fsx
echo 111 > /sys/class/gpio/unexport
echo 111 > /sys/class/gpio/export
fi
cat /sys/kernel/debug/omap_mux/mcasp0_fsx

if [ $1 == "spi" ]; then
#D1 - this is spi data 'output' (note swapped)
#P9.30 - EMx_SPI_MOSI  - SPI1_D1  - SPI1_D1 - mode SPI (3)
echo 0x23 > /sys/kernel/debug/omap_mux/mcasp0_axr0
else
#P9.30 - EMx_SPI_MOSI - SPI1_D1  - GPIO3_16 - mode GPIO (7)
echo 0x3f > /sys/kernel/debug/omap_mux/mcasp0_axr0
echo 112 > /sys/class/gpio/unexport
echo 112 > /sys/class/gpio/export
fi
cat /sys/kernel/debug/omap_mux/mcasp0_axr0

if [ $1 == "spi" ]; then
#Due to D0/D1 swap, receiver must be enabled on this pin, even though clock is output - need root-cause
#P9.31 - EMx_SPI_SCLK - SPI1_SCLK  - SPI1_SCLK - mode SPI (3)
echo 0x23 > /sys/kernel/debug/omap_mux/mcasp0_aclkx
else
#P9.31 - EMx_SPI_SCLK - SPI1_SCLK  - GPIO3_14 - mode GPIO (7)
echo 0x3f > /sys/kernel/debug/omap_mux/mcasp0_aclkx
echo 110 > /sys/class/gpio/unexport
echo 110 > /sys/class/gpio/export
fi
cat /sys/kernel/debug/omap_mux/mcasp0_aclkx

#P9.41 - EMx_SLOW_CLK - CLKOUT2  - CLKOUT2 - mode CLKOUT2 (3)
echo 0x03 > /sys/kernel/debug/omap_mux/xdma_event_intr1
#P9.41 - EMx_SLOW_CLK - CLKOUT2  - GPIO0_20 - mode GPIO (7)
echo 0x3f > /sys/kernel/debug/omap_mux/xdma_event_intr1
cat /sys/kernel/debug/omap_mux/xdma_event_intr1
echo 20 > /sys/class/gpio/unexport
echo 20 > /sys/class/gpio/export

#P9.42 - EMx_SPI_CSn_a - GPIO0_7  - SPI1_CS1 - mode SPI (2)
#echo 0x03 > /sys/kernel/debug/omap_mux/ecap0_in_pwm0_out
#P9.42 - EMx_SPI_CSn_a - GPIO0_7  - GPIO0_7 - mode GPIO (7)
echo 0x3f > /sys/kernel/debug/omap_mux/ecap0_in_pwm0_out
cat /sys/kernel/debug/omap_mux/ecap0_in_pwm0_out
echo 7 > /sys/class/gpio/unexport
echo 7 > /sys/class/gpio/export


echo .
echo "Done"
echo .

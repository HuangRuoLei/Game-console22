//% color="#006400" weight=50 icon="\uf1b9" block="初始化蜘蛛机器人"
namespace HuLuMaoCar_connection {
    const PCA9685_adrr1=0x40;
    const PCA9685_MODE1=0x00;
    const PCA9685_PRESCALE=0xFE;	//控制周期寄存器
    export function IICWrite2(value:number,value1:number) {
        
        pins.i2cWriteNumber(value, value1, NumberFormat.UInt8LE);
    }
    export function IICWriteBuf3(value: number, value1: number, value2: number) {
        let buf = pins.createBuffer(2);
        buf[0] = value1;
        buf[1] = value2;
        
        pins.i2cWriteBuffer(value, buf);
    }
    export function IICWriteBuf5(value: number, value1: number, value2: number, value3: number, value4: number) {
        let buf = pins.createBuffer(4);
        buf[0] = value1;
        buf[1] = value2;
        buf[2] = value3;
        buf[3] = value4;
        
        pins.i2cWriteBuffer(value, buf);
    }
    function SPIWrite(value: number) {
        pins.spiPins(DigitalPin.P0, DigitalPin.P1, DigitalPin.P2);
        pins.spiFormat(8, 3);
        pins.spiFrequency(100000);
        pins.spiWrite(value);
    }
    /*向PCA9685指定的寄存器地址写入数据
    value:芯片寄存器地址
    value1:写入的数据
    */
    export function PCA9685_Write(value:number,value1:number) {
        //PCA9685_adrr1 芯片片选地址,代表写操作
        IICWriteBuf3(PCA9685_adrr1,value,value1);
    }
    /*向PCA9685指定的寄存器地址读出数据
    value:芯片寄存器地址
    */
    export function PCA9685_Read(value:number):number {
        let leng;
        //PCA9685_adrr1 芯片片选地址,代表写操作   PCA9685_adrr1|0x01 代表读操作
        IICWrite2(PCA9685_adrr1,value);
        leng=pins.i2cReadNumber(PCA9685_adrr1, NumberFormat.UInt8LE); 
        return leng;
    }

    export function PCA9685_setpwm(value:number,value1:number){
        value1=102+408*value1/180;
        PCA9685_Write(0x06+4*value,0);
        PCA9685_Write(0x07+4*value,0>>8);
        PCA9685_Write(0x08+4*value,value1);
        PCA9685_Write(0x09+4*value,value1>>8);
    }
    /**
     * 
     * @param index
    */
    //% blockId=HuLuMaoCar_connection_con block="建立 MicroBit 与蜘蛛机器人的通信"
    //% weight=100
    //% blockGap=10
    //% color="#006400"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=10
    export function con(): void {
        let freq=50,prescale,oldmode,newmode;;
        let prescaleval;
        PCA9685_Write(PCA9685_MODE1,0);
        freq*=0.97;
        prescaleval = 25000000;
		prescaleval /= 4096;
		prescaleval /= freq;
		prescaleval -= 1;
        prescale =Math.floor(prescaleval + 0.5);
        oldmode=PCA9685_Read(PCA9685_MODE1);
        newmode = (oldmode&0x7F) | 0x10; // sleep
        PCA9685_Write(PCA9685_MODE1,newmode);
        PCA9685_Write(PCA9685_PRESCALE, prescale); // 设置预分频器
        PCA9685_Write(PCA9685_MODE1, oldmode);
        basic.pause(2);
        PCA9685_Write(PCA9685_MODE1, oldmode | 0xa1);
        PCA9685_Write(0xFD,0x10);
    }   

    /**
     * 
     * @param index
    */
    //% blockId=HuLuMaoCar_connection_control block="控制PWM输出"
    //% weight=99
    //% blockGap=10
    //% color="#006400"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=10
    export function control(): void {
        PCA9685_setpwm(0,90);
    }  
}


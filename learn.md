## BigNumber
用于大数运算。因为星云链的交易金额以及gas都是以wei计量，换算比例为1nas=1e18wei即1nas=1000,000,000,000,000,000wei。如果智能合约中计算金额使用常用的加减乘除方式可能会引入bug或者出现计算结果精度丢失，因此建议金额类型的变量先转成BigNumber类型后再处理。  

+ 乘法 new BigNumber(x).plus(y)  
+ 减法 new BigNumber(x).plus(y)  
+ 小于 lessThan
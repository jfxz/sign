<template>
	<view class="contents">
		<canvas
			class="firstCanvas"
			canvas-id="firstCanvas"
			@touchmove="move"
			@touchstart="start($event)"
			@touchend="end"
			@touchcancel="cancel"
			@longtap="tap"
			disable-scroll="true"
			@error="error"
		></canvas>
		<view class="operation">
			<view class="chongqian" @tap="clearClick">重签</view>
			<view class="over" @tap="overSign">完成签名</view>
		</view>
	</view>
</template>

<script>

var content = null;
var touchs = [];
var _that;
export default {
	data() {
		return {
      canvasw: 0,
      canvash: 0,
			signImage: '',
			isEnd: false // 是否签名
		}
	},
  /**
   * 生命周期函数--初始化canvas
   */
  onLoad: function(options) {
    console.log('onLoad')
    // #ifdef APP-PLUS
    plus.screen.lockOrientation('landscape-primary')
    // #endif
    
  },
	onReady () {
		_that = this
    console.log('onReady')
    setTimeout(() => {
      _that.getSystem()
      
      //获得Canvas的上下文
      content = uni.createCanvasContext('firstCanvas')
      //设置线的颜色
      content.setStrokeStyle("#000")
      //设置线的宽度
      content.setLineWidth(5)
      //设置线两端端点样式更加圆润
      content.setLineCap('round')
      //设置两条线连接处更加圆润
      content.setLineJoin('round')
    }, 500)
	},
	methods: {
    //获取系统信息
    getSystem () {
      uni.getSystemInfo({
      	success: function(res) {
          _that.canvasw = res.windowWidth
          _that.canvash = res.windowHeight
          console.log(_that.canvasw, _that.canvash)
      	}
      })
    },
    
		// 结束签名，上传到阿里云
		overSign () {
			if (this.isEnd) {
				uni.canvasToTempFilePath({
					canvasId: 'firstCanvas',
          fileType: 'png',
          destWidth: 100,
          destHeight: 100,
					success: function(res) {
						//打印图片路径
						console.log(res.tempFilePath)
            _that.signImage = res.tempFilePath
            getApp().globalData.imgeSrc = _that.signImage
						uni.navigateBack()
            console.log('完成签名')
					}
				})
			} else {
				uni.showToast({
					title: '请先完成签名',
					icon: "none",
					duration: 1500,
					mask: true
				})
			}

		},

		// 画布的触摸移动开始手势响应
		start: function(event) {
			// console.log(event)
			//获取触摸开始的 x,y
			let point = {
				x: event.changedTouches[0].x,
				y: event.changedTouches[0].y
			}
			// console.log(point)
			touchs.push(point);

		},
		// 画布的触摸移动手势响应
		move: function(e) {
			let point = {
				x: e.touches[0].x,
				y: e.touches[0].y
			}
			// console.log(point)
			touchs.push(point)
			if (touchs.length >= 2) {
				this.draw(touchs)
			}
		},

		// 画布的触摸移动结束手势响应
		end: function(e) {
			console.log("触摸结束" + e)
			// 设置为已经签名
			this.isEnd = true
			// 清空轨迹数组
			for (let i = 0; i < touchs.length; i++) {
				touchs.pop()
			}

		},

		// 画布的触摸取消响应
		cancel: function(e) {
			console.log("触摸取消" + e)
		},

		// 画布的长按手势响应
		tap: function(e) {
			console.log("长按手势" + e)
		},

		error: function(e) {
			console.log("画布触摸错误" + e)
		},

		//绘制
		draw: function(touchs) {
			let point1 = touchs[0]
			let point2 = touchs[1]
			touchs.shift()
			content.moveTo(point1.x, point1.y)
			content.lineTo(point2.x, point2.y)
			content.stroke()
			content.draw(true)
		},
		//清除操作
		clearClick: function() {
			// 设置为未签名
			this.isEnd = false
			//清除画布
			console.log(this.canvasw, this.canvash)
			content.clearRect(0, 0, this.canvasw, this.canvash)
			content.draw(true)
		}
	}
}
</script>

<style>
 .firstCanvas {
   background-color: #dddddd;
   width: 100%;
   height: calc(100vh - 160upx);
 }

.contents {
  padding: 20rpx;
	box-sizing: border-box;
  overflow: auto;
}

#signatureImg {
	background-color: #eeeeee;
}

.operation {
	display: flex;
	height: 100upx;
	width: 100%;
	position: fixed;
	left: 0;
	bottom: 20rpx;
}

.operation view {
	width: 50%;
	text-align: center;
	height: 100upx;
	line-height: 100upx;
	color: #ffffff;
}

.operation view:active {
	background-color: #cccccc;
	color: #333333;
}

.chongqian {
	background-color: #ff8f58;
}

.over {
	background-color: #0599d7;
}
</style>

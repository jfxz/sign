<template>
	<view class="contract">
    <view class="contract-canvas">
      <canvas
      	class="myCanvas"
      	canvas-id="myCanvas"
      ></canvas>
      <!-- <image src="../../static/img1.jpg" mode="aspectFit"></image> -->
    </view>
		<view class="btn">
		  <button type="primary" @tap="sign">签名</button>
			<button type="primary" @tap="upload">上传</button>
		</view>
	</view>
  
</template>

<script>
//获取系统信息
var canvasw = 0;
var canvash = 0;
uni.getSystemInfo({
	success: function(res) {
		canvasw = res.windowWidth;
		canvash = res.windowHeight;
	},
})

import dayJs from '../../static/dayjs.min.js'
export default {
	data() {
		return {
			ctx: null,
			signImage: ''
		}
	},
  onLoad () {
    // getApp().globalData.imgeSrc = ''
  },
  onShow () {
    // #ifdef APP-PLUS
    plus.screen.lockOrientation('portrait-primary')
    // #endif
    setTimeout(() => {
     this.initCanvas()
     console.log('getSrc:', getApp().globalData.imgeSrc)
     let img2 = getApp().globalData.imgeSrc
     if (img2) {
       this.ctx.drawImage(img2, 160, 530, 100, 100)
       this.ctx.draw({reserve: true}) // 不重写 保留
     } 
    }, 500)
    
  },
	onReady () {
    this.ctx = uni.createCanvasContext('myCanvas')
    this.initCanvas()
	},
	methods: {
		upload () {
			var that = this
			uni.canvasToTempFilePath({
				canvasId: 'myCanvas',
			  fileType: 'png',
				success: function(res) {
					//打印图片路径
					console.log(res.tempFilePath)
			    that.signImage = res.tempFilePath
			   //设置图片
			   let timestamp = dayJs().valueOf()
			   that.$loading('上传中')
			   var count = 0
			   uniCloud.uploadFile({
			   		filePath: that.signImage,
			   		cloudPath: `${timestamp}-签名.png`,
			   		onUploadProgress: function(progressEvent) {
			   			console.log(progressEvent);
			   			var percentCompleted = Math.round(
			   				(progressEvent.loaded * 100) / progressEvent.total
			   			);
			   			if (percentCompleted === 100 & count === 0) {
			           count++
			   				uni.hideLoading()
			   				that.$message('上传成功')
			   			}
			   			console.log('percentCompleted', percentCompleted)
			   		}
			   });
				}
			})
		  
		},
    initCanvas () {
     this.ctx.drawImage('../../static/img1.jpg', 0, 0, canvasw, 600)
     this.ctx.draw() 
    },
		sign () {
      uni.navigateTo({
        url: 'sign'
      })
    }
	}
}
</script>

<style lang="scss">
  .contract {
    .contract-canvas {
      .myCanvas {
        width: 100%;
        height: calc(100vh - 150rpx);
      }
    }
    .btn {
      position: relative;
			bottom: 60rpx;
			button {
				margin-bottom: 20rpx;
			}
    }
  }
</style>

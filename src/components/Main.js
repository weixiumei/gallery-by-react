require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import ReactDOM from 'react-dom';

//以下的带*为解决问题
//state变化，视图会重新渲染。
//闭包：就是能够读取其他函数内部变量的函数,也就是定义在一个函数内部的函数,所以闭包就是把函数内部和函数内部连接起来的一个桥梁。 

//获取图片相关数据
let imageDatas = require('json!../data/imageDatas.json');

//利用自执行函数，将图片名信息转成图片URL路径信息。
function genImageURL(imageDataArr){
  for(var i = 0; i < imageDataArr.length; i++ ){
    var singleImageData = imageDataArr[i];
    singleImageData.imageURL = require('../images/' + singleImageData.fileName);
    imageDataArr[i] = singleImageData;
  }
  return imageDataArr;
}
imageDatas = genImageURL(imageDatas);

/*
 *获取区间内的随机值
 */
function getRangeRandom(low, high){
  //[low, )
  return Math.ceil(low + Math.random()*(high - low));

}

/*
 *获取0~30区间内的正负随机值
 */
function get30DegRandom(){
  return (Math.random() > 0.5 ? '-' : '') + Math.ceil(Math.random() * 30)
}

var ImgFigure = React.createClass({

  /*
   *imageFigure的点击处理函数
   */
  handleClick(e){
    if(this.props.arrange.isCenter){
      this.props.inverse();
    }else{
      this.props.center();
    }
    e.stopPropagation();
    e.preventDefault();
  },

  render: function(){
    //style设定
    var styleObj = {};

    //如果props属性中指定了这张图片的位置，则使用
    if(this.props.arrange.pos){
      styleObj = this.props.arrange.pos;
    }

    //如果props属性中指定了这张图片的旋转角度，则使用
    if(this.props.arrange.rotate){
      (['Moz','ms','Webkit','']).forEach(function(value){
          styleObj[value + 'Transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
      }.bind(this));
    }

    if(this.props.arrange.isCenter){
      styleObj.zIndex = 11;//中心图片不被盖住。
    }

    var imgFigureClassName = "img-figure";
    imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';

    return (
        <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
          <img src={this.props.data.imageURL} alt={this.props.data.title} />
          <figcaption>
            <h2 className="img-title">{this.props.data.title}</h2>
            <div className="img-back" onClick={this.handleClick}>
              <p>
                  {this.props.data.desc}
              </p>
            </div>
          </figcaption>
        </figure>
      )
  }
});

class AppComponent extends React.Component {
  
  constructor(props) {
    super(props);
    this.Constant = {
    // 中心图片位置点。
      centerPos:{
        left:0,
        right:0
      },
      //水平方向的取值范围。
      hPosRange:{
        leftSecX: [0,0],//左分区x的取值范围
        rightSecX: [0,0],//右分区的x取值范围
        y: [0,0]
      },
      //垂直方向的取值范围
      vPosRange:{
        x:[0,0],
        topY:[0,0]
      }
    }
    this.state = {imgsArrangeArr: [
        {
          //css object style
          pos:{
            left:'0',
            top:'0'
            },
          rotate:0,   //旋转角度
          isInverse:false,  //正反面 默认正面
          isCenter:false   //图片是否居中 默认不居中
          }]
        };
  }
  
  /*
   * 翻转图片
   * @param index 输入当前被执行的inverse操作的图片信息数组的index值
   * @return {function} 这是一个闭包函数， 其内return一个真正待被执行的函数
   */
   inverse(index){
    return function(){
      var imgsArrangeArr = this.state.imgsArrangeArr;
      imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
      
      this.setState({
        imgsArrangeArr:imgsArrangeArr
      })

    }.bind(this);
   }

  /*
   *重新布局所有图片
   *@param 指定居中排布哪个图片
   */
  rearrange(centerIndex){
    var imgsArrangeArr = this.state.imgsArrangeArr,
        Constant = this.Constant,
        centerPos = Constant.centerPos,
        hPosRange = Constant.hPosRange,
        vPosRange = Constant.vPosRange,
        hPosRangeLeftSecX = hPosRange.leftSecX,
        hPosRangeRightSecX = hPosRange.rightSecX,
        hPosRangeY = hPosRange.y,
        vPosRangeTopY = vPosRange.topY,
        vPosRangeX = vPosRange.x,

        //用来存储上侧区域的图片的状态信息。
        imgsArrangeTopArr = [],
        //取一个或不取[0,2)
        topImgNum = Math.ceil(Math.random() * 1),
        //用来标记我们用来布局在上侧区域的这张图片是从数组对象的哪个位置拿出来的。
        topImgSpliceIndex = 0,

        //居中图片的状态信息(从centerIndex这个位置剔除掉1个，拿到的就是centerIndex这个位置所表示的图片信息，就是中心图片的状态)
        imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1)

        //首先居中 centerIndex 的图片, 居中的 centerIndex 的图片不需要旋转。
        imgsArrangeCenterArr[0] = {
          pos:centerPos,
          rotate:0,
          isCenter:true
        }

        //取出要布局上侧的图片的状态信息
        topImgSpliceIndex = Math.ceil(Math.random() * imgsArrangeArr.length - topImgNum);
        imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

        //布局位于上侧的图片
        imgsArrangeTopArr.forEach(function(value, index){
          imgsArrangeTopArr[index] = {
            pos:{
              top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
              left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
            },
            rotate:get30DegRandom(),
            isCenter:false
          };
        });

        //布局左右两侧的图片
        for(var i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++){
          //左区域或右区域x的取值范围
          var hPosRangeLORX = null;

          //前半部分布局左边，后半部分布局右边
          if(i < k){
            hPosRangeLORX = hPosRangeLeftSecX;
          }else{
            hPosRangeLORX = hPosRangeRightSecX;
          }

          imgsArrangeArr[i] = {
            pos:{
              top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
              left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
            },
            rotate:get30DegRandom(),
            isCenter:false
          };
        }

        //上侧图片塞回去
        if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
          imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
        }

        //中心区域图片塞回去
        imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

        //设置state，触发component重新渲染
        this.setState({
          imgsArrangeArr: imgsArrangeArr
        });
  }

  /*
   * 利用rearrange函数，居中对应index的图片。
   * @param index，需要被居中的图片对应的图片信息数组的index值。
   */
   center(index){
    return function(){
      this.rearrange(index);
    }.bind(this);
   }

  //组件加载以后，为每张图片计算其位置的范围。
  //*新版react不是componentDidMount: function()..结束方法后没有逗号*
  componentDidMount() {
    //scrollWidth：对象的实际内容的宽度，不包边线宽度，会随对象中内容超过可视区后而变大。clientWidth：对象内容的可视区的宽度，不包滚动条等边线，会随对象显示大小的变化而改变。offsetWidth：对象整体的实际宽度，包滚动条等边线，会随对象显示大小的变化而改变。

    //首先拿到舞台的大小
    //*react 是新版 React.findDOMNode==>ReactDOM.findDOMNode(上面得import ReactDOM from 'react-dom';)*
    var stageDOM = ReactDOM.findDOMNode(this.refs.stage),
        stageW = stageDOM.scrollWidth,
        stageH = stageDOM.scrollHeight,
        halfStageW = Math.ceil(stageW/2),
        halfStageH = Math.ceil(stageH/2);

    //拿到一个imageFigure的大小
    var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
        imgW = imgFigureDOM.scrollWidth,
        imgH = imgFigureDOM.scrollHeight,
        halfImgW = Math.ceil(imgW/2),
        halfImgH = Math.ceil(imgH/2);

    //计算中心图片的位置点。
    this.Constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    }

    //左侧区域图片排布位置x的取值范围
    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    //右侧区域图片排布位置x的取值范围
    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    //左右侧区域图片排布位置y的取值范围
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;

    //上侧区域图片排布位置的取值范围
    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;
    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    
    this.rearrange(0);

  }//*没有','*

  render(){
    var controllerUnits = [],
        imgFigures = [];

    imageDatas.forEach(function(value, index){
      if(!this.state.imgsArrangeArr[index]){
        this.state.imgsArrangeArr[index] = {
          pos:{
            left:0,
            top:0
          },
          rotate:0,
          isInverse:false,
          isCenter:false
        }
      }
      imgFigures.push(<ImgFigure ref={'imgFigure' + index} key={value.fileName}
        data={value} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} 
        center={this.center(index)}/>) //inverse,center是闭包。
    }.bind(this));//bind(this):把reactComponent对象传递到function中。这样可以调用this。
    return (
        <section className="stage" ref="stage">
          <section className="img-sec">
            {imgFigures}
          </section>
          <nav className="controller-nav">
            {controllerUnits}
          </nav>
        </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;


//init,render,componentDidMount,render
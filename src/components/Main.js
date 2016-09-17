require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import ReactDOM from 'react-dom';

//以下的带*为解决问题

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

var ImgFigure = React.createClass({
  render: function(){
    return (
        <figure className="img-figure">
          <img src={this.props.data.imageURL} alt={this.props.data.title} />
          <figcaption>
            <h2 className="img-title">{this.props.data.title}</h2>
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
  }
  
  //在取值范围内排布这些图片。 
  /*
   *重新布局所有图片
   *@param 指定居中排布哪个图片
   */
  rearrange(centerIndex){

  }

  getInitialStage(){
    return{
      //存储多个图片的状态
      imgsArrangeArr:[
        /*{
          pos:{
            left:'0',
            top:'0'
          }
        }*/
      ]
    }

  }

  //组件加载以后，为每张图片计算其位置的范围。
  //*新版react不是componentDidMount: function()..结束方法后没有逗号*
  componentDidMount() {

    //scrollWidth：对象的实际内容的宽度，不包边线宽度，会随对象中内容超过可视区后而变大。 
    //clientWidth：对象内容的可视区的宽度，不包滚动条等边线，会随对象显示大小的变化而改变。 
    //offsetWidth：对象整体的实际宽度，包滚动条等边线，会随对象显示大小的变化而改变。

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
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH*3;
    
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
          }
        }
      }

      imgFigures.push(<ImgFigure ref={'imgFigure' + index} key={value.fileName} data={value}/>)
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

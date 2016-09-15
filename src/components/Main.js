require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';

// let yeomanImage = require('../images/yeoman.png');
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

//单单幅画的reactComponent
let ImgFigure = React.createClass({
  render: function(){

    return (
          //自包含内容==单独拿出来放到哪里也是有意义的。
          <figure>
              <img src={this.props.data.imageURL} 
              alt={this.props.data.title}/>
              <figcaption>
                <h2>{this.props.data.title}</h2>
              </figcaption>
          </figure>
          )
  }
})

class AppComponent extends React.Component {
  render() {

    var controllerUnits =[],
        imgFigures = [];

    imageDatas.forEach(function(value){
      imgFigures.push(<ImgFigure data={value}/>);
    });

    return (
        <section className="stage">
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

import React from 'react';
import Signin from './components/Signin/Signin';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Clarifai from 'clarifai';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import './App.css';
import Particles from 'react-particles-js';

const app = new Clarifai.App({
  apiKey: 'fa36c442fc2545afa28038abb2355337'
})

const particleOptions = {
  particles: {
    number: {
      value: 80,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

class App extends React.Component { 
  constructor() {
    super();
    this.state = {
      input: '',
      imageURL: '',
      box: [{}],
    };
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  }

  calculateFaceLocation = (data) => {
    const faceNumber = data.outputs[0].data.regions.length;
    for(var i=0; i < faceNumber; i++) {
      console.log(i);
    }
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    console.log(data);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (dimension) => {
    this.setState({ box: dimension });
  }

  onButtonSubmit = () => {
    this.setState({ imageURL: this.state.input });
    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
    .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
    .catch(err => console.log(err));
  }

  render() {
    return (
      <div className="App">
        <Particles className='particles'
          params={particleOptions} />
        {/*<Signin />*/}
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
        <FaceRecognition box={this.state.box} imageURL={this.state.imageURL} />
      </div>
    );
  } 
  
}

export default App;

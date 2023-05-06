import './App.css';
import button_logo from "./images/logo/play.png"
import image_logo from "./images/logo/image.png"
import out_logo from "./images/logo/out.png"
import scan_logo from "./images/logo/scan.png"
import download_logo from "./images/logo/download.png"
import React, { useState } from 'react';


function PlayButton({ buttonFunction }) {
  return (
    <>
      <button className='button'>
        <img src={button_logo} class="play" onClick={buttonFunction}/>
      </button>
    </>
    );
}

function Logos({image, imageName}) {
  return (
    <>
      <div className='big_circle'>
        <div className='small_circle'>
          <img src={image} class={imageName}>
          </img>
        </div>
      </div>
    </>
  );
}


export default function Index(){
  return (
    <>
      <div className='container' >
        {/*  */}
        <div className='Step1'>
          <Logos image={image_logo} imageName="image"/>
          <PlayButton/>
        </div>
        <div className='line'></div>
        {/*  */}
        <div className='Step2'>
          <Logos image={out_logo} imageName="out"/>
          <PlayButton/>
        </div>
        <div className='line'></div>
        {/*  */}
        <div className='Step3'>
          <Logos image={scan_logo} imageName="scan"/>
          <PlayButton/>
        </div>
        <div className='line'></div>
        {/*  */}
        <div className='Step4'>
          <Logos image={download_logo} imageName="download"/>
          <PlayButton/>
        </div>
      </div>
    </>
  );
}

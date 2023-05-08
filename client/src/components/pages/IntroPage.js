import React from 'react'
import './css/IntroPage.css'
import introImage1 from '../../images/IntroImage1.svg'
import introImage2 from '../../images/IntroImage2.svg'
import introImage3 from '../../images/IntroImage3.svg'
import introImage5 from '../../images/IntroImage5.svg'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';
import Header from '../Layout/Header'

function IntroPage(){
    return (
        <div>
            <Header />
            <div className='partOne'>
                <div className='USP'>
                    <h1>Take control of your spending, one penny at a time!</h1>
                    <p className='desc'>Create a budget. Track your expenses. Analyze your expenditure. Lend money to your friends.</p>
                </div>
                <img src={introImage1} alt="Pay" className='introImage1'/>
            </div>
            <br /><br /><br /><br /><br />
            <div className="partTwo">
                <div className='flex-item'>
                    <img src={introImage2} alt="Pay" className='featureImage'/>
                    <h5>Organize expenditure</h5>
                    <p>Categorize and arrange all your expenses type, date, or purpose.</p>
                </div>
                <div className='flex-item'>
                    <img src={introImage3} alt="Pay" className='featureImage'/>
                    <h5>Add expenses</h5>
                    <p>Record a new spending item to your existing list of expenses or create a new one .</p>
                </div>
                <div className='flex-item'>
                    <img src={introImage5} alt="Pay" className='featureImage'/>
                    <h5>Examine spends</h5>
                    <p>Analyze expenses within a certain period, such as a week or a month.</p>
                </div>
            </div>
            <hr />
            <footer className='d-flex justify-content-around align-items-center'>
                <span className="logo-name">FinMate</span>
                <div>
                    <p className='d-inline pe-5'>About</p>
                    <p className='d-inline'>Help</p>
                </div>
                <div>
                    <FontAwesomeIcon className='d-inline pe-4 icons' icon={faFacebook}/>
                    <FontAwesomeIcon className='d-inline pe-4 icons' icon={faTwitter}/>
                    <FontAwesomeIcon className='d-inline pe-4 icons' icon={faInstagram}/>
                </div>
            </footer>
            <br /><br /><br />
        </div>
      )
}

export default IntroPage
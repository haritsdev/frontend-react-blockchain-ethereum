import React from 'react'
import {Navbar,Welcome,Footer,Services,Transactions} from './components'

const App = () => {
  return (
    <div className='min-h-screen'>
        <div className="gradient-bg-welcome">
        {/* <div> */}
          <Navbar/>
          <Welcome/>
          <h1>ARIS</h1>
        </div>
        <Services/>
        <Transactions/>
        <Footer/>
    </div>
  )
}

export default App

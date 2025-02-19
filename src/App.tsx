import './App.css'
import { Builder } from './components/Builder'
import { Preview } from './components/Preview'


function App() {
  return (
    <div className='max-w-7xl mx-auto'>
      <h1 className='text-white text-4xl py-12 font-extrabold'>Form Builder</h1>
      <main className='grid grid-cols-1 gap-4 md:grid-cols-2 text-white'>
        <div className=''>
          <Builder />
        </div>
        <div className=''>
          <Preview />
        </div>
      </main>
    </div>
  )
}

export default App

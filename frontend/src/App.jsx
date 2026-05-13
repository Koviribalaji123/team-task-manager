import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {

  const [isLogin, setIsLogin] = useState(true)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })

  const [message, setMessage] = useState('')

  const [token, setToken] = useState(
    localStorage.getItem('token') || ''
  )

  const [dashboard, setDashboard] = useState(null)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const fetchDashboard = async (savedToken) => {

    try {

      const response = await axios.get(
        'https://team-task-manager-production-850d.up.railway.app/api/dashboard',
        {
          headers: {
            authorization: savedToken
          }
        }
      )

      setDashboard(response.data)

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {

    if (token) {
      fetchDashboard(token)
    }

  }, [token])

  const handleSubmit = async (e) => {

    e.preventDefault()

    try {

      const url = isLogin
        ? 'https://team-task-manager-production-850d.up.railway.app/api/auth/login'
        : 'https://team-task-manager-production-850d.up.railway.app/api/auth/signup'

      const response = await axios.post(url, formData)

      setMessage(response.data.message)

      if (response.data.token) {

        localStorage.setItem(
          'token',
          response.data.token
        )

        setToken(response.data.token)
      }

    } catch (error) {

      setMessage(
        error.response?.data?.message ||
        'Something went wrong'
      )
    }
  }

  const logout = () => {

    localStorage.removeItem('token')

    setToken('')
    setDashboard(null)
  }

  if (token && dashboard) {

    return (

      <div style={{
        padding: '40px',
        background: '#f4f4f4',
        minHeight: '100vh'
      }}>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>

          <h1>Team Task Manager Dashboard</h1>

          <button
            onClick={logout}
            style={{
              padding: '10px 20px',
              background: 'red',
              color: 'white',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>

        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '20px',
          marginTop: '30px'
        }}>

          <DashboardCard
            title="Total Tasks"
            value={dashboard.totalTasks}
          />

          <DashboardCard
            title="To Do"
            value={dashboard.todo}
          />

          <DashboardCard
            title="In Progress"
            value={dashboard.inProgress}
          />

          <DashboardCard
            title="Done"
            value={dashboard.done}
          />

          <DashboardCard
            title="Overdue"
            value={dashboard.overdue}
          />

        </div>

      </div>
    )
  }

  return (

    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: '#f4f4f4'
    }}>

      <div style={{
        width: '350px',
        background: 'white',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)'
      }}>

        <h2 style={{ textAlign: 'center' }}>
          Team Task Manager
        </h2>

        <form onSubmit={handleSubmit}>

          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Name"
              onChange={handleChange}
              style={inputStyle}
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            style={inputStyle}
          />

          <button style={buttonStyle}>
            {isLogin ? 'Login' : 'Signup'}
          </button>

        </form>

        <p style={{
          textAlign: 'center',
          color: 'green'
        }}>
          {message}
        </p>

        <p
          onClick={() => setIsLogin(!isLogin)}
          style={{
            textAlign: 'center',
            cursor: 'pointer',
            color: 'blue'
          }}
        >
          {
            isLogin
            ? 'Create new account'
            : 'Already have an account? Login'
          }
        </p>

      </div>

    </div>
  )
}

function DashboardCard({ title, value }) {

  return (

    <div style={{
      background: 'white',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)'
    }}>

      <h2>{title}</h2>

      <h1>{value}</h1>

    </div>
  )
}

const inputStyle = {
  width: '100%',
  padding: '10px',
  marginBottom: '15px'
}

const buttonStyle = {
  width: '100%',
  padding: '10px',
  background: '#333',
  color: 'white',
  border: 'none',
  cursor: 'pointer'
}

export default App
import { useEffect, useState } from 'react'
import axios from 'axios'
import {
  FaTasks,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaUserShield
} from 'react-icons/fa'

function App() {

  const [isLogin, setIsLogin] = useState(true)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })

  const [message, setMessage] = useState('')

  const [role, setRole] = useState(
    localStorage.getItem('role') || ''
  )

  const [token, setToken] = useState(
    localStorage.getItem('token') || ''
  )

  const [dashboard, setDashboard] = useState(null)

  const [showTaskForm, setShowTaskForm] = useState(false)

  const [showMemberForm, setShowMemberForm] = useState(false)

  const [memberId, setMemberId] = useState('')

  const [projectId, setProjectId] = useState('')

  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    priority: 'High',
    status: 'To Do'
  })

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleTaskChange = (e) => {

    setTaskData({
      ...taskData,
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

  const createTask = async () => {

    try {

      await axios.post(
        'https://team-task-manager-production-850d.up.railway.app/api/tasks/create',
        taskData,
        {
          headers: {
            authorization: token
          }
        }
      )

      alert('Task created successfully')

      setShowTaskForm(false)

      fetchDashboard(token)

    } catch (error) {

      console.log(error)

      alert('Failed to create task')
    }
  }

  const addMember = async () => {

    try {

      await axios.put(
        `https://team-task-manager-production-850d.up.railway.app/api/projects/add-member/${projectId}`,
        {
          userId: memberId
        },
        {
          headers: {
            authorization: token
          }
        }
      )

      alert('Member added successfully')

      setShowMemberForm(false)

      setMemberId('')
      setProjectId('')

    } catch (error) {

      console.log(error)

      alert('Failed to add member')
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

        localStorage.setItem(
          'role',
          response.data.user.role
        )

        setRole(response.data.user.role)

        setToken(response.data.token)

        setMessage('')
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
    localStorage.removeItem('role')

    setToken('')
    setRole('')
    setDashboard(null)
    setMessage('')
  }

  if (token && dashboard) {

    return (

      <div style={{
        minHeight: '100vh',
        background: '#eef2ff',
        padding: '30px'
      }}>

        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '25px',
          boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
          marginBottom: '30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>

          <div>

            <h1 style={{
              margin: 0,
              color: '#1e293b'
            }}>
              Team Task Manager
            </h1>

            <p style={{
              color: '#64748b',
              marginTop: '10px'
            }}>
              Welcome back
            </p>

            <div style={{
              display: 'inline-block',
              background:
                role === 'Admin'
                ? '#dc2626'
                : '#2563eb',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '20px',
              marginTop: '10px',
              fontWeight: 'bold'
            }}>
              <FaUserShield /> {role}
            </div>

          </div>

          <button
            onClick={logout}
            style={{
              background: '#ef4444',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Logout
          </button>

        </div>

        {
          role === 'Admin' && (

            <div style={{
              display: 'flex',
              gap: '15px',
              marginBottom: '25px'
            }}>

              <button
                style={adminButtonStyle}
                onClick={() => setShowTaskForm(true)}
              >
                Create Task
              </button>

              <button
                style={adminButtonStyle}
                onClick={() => setShowMemberForm(true)}
              >
                Add Member
              </button>

            </div>
          )
        }

        {
          showTaskForm && (

            <div style={{
              background: 'white',
              padding: '25px',
              borderRadius: '20px',
              marginBottom: '25px',
              boxShadow: '0 8px 20px rgba(0,0,0,0.08)'
            }}>

              <h2>Create Task</h2>

              <input
                type="text"
                name="title"
                placeholder="Task Title"
                onChange={handleTaskChange}
                style={inputStyle}
              />

              <textarea
                name="description"
                placeholder="Description"
                onChange={handleTaskChange}
                style={{
                  ...inputStyle,
                  height: '100px'
                }}
              />

              <select
                name="priority"
                onChange={handleTaskChange}
                style={inputStyle}
              >
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>

              <button
                onClick={createTask}
                style={buttonStyle}
              >
                Submit Task
              </button>

            </div>
          )
        }

        {
          showMemberForm && (

            <div style={{
              background: 'white',
              padding: '25px',
              borderRadius: '20px',
              marginBottom: '25px',
              boxShadow: '0 8px 20px rgba(0,0,0,0.08)'
            }}>

              <h2>Add Member</h2>

              <input
                type="text"
                placeholder="Project ID"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                style={inputStyle}
              />

              <input
                type="text"
                placeholder="User ID"
                value={memberId}
                onChange={(e) => setMemberId(e.target.value)}
                style={inputStyle}
              />

              <button
                onClick={addMember}
                style={buttonStyle}
              >
                Add Member
              </button>

            </div>
          )
        }

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px'
        }}>

          <DashboardCard
            title="Total Tasks"
            value={dashboard.totalTasks}
            icon={<FaTasks />}
          />

          <DashboardCard
            title="To Do"
            value={dashboard.todo}
            icon={<FaClock />}
          />

          <DashboardCard
            title="In Progress"
            value={dashboard.inProgress}
            icon={<FaTasks />}
          />

          <DashboardCard
            title="Done"
            value={dashboard.done}
            icon={<FaCheckCircle />}
          />

          <DashboardCard
            title="Overdue"
            value={dashboard.overdue}
            icon={<FaExclamationTriangle />}
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
      minHeight: '100vh',
      background: 'linear-gradient(to right, #4f46e5, #7c3aed)'
    }}>

      <div style={{
        width: '380px',
        background: 'white',
        padding: '35px',
        borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
      }}>

        <h1 style={{
          textAlign: 'center',
          color: '#1e293b'
        }}>
          Team Task Manager
        </h1>

        <p style={{
          textAlign: 'center',
          color: '#64748b'
        }}>
          Manage projects and tasks efficiently
        </p>

        <form onSubmit={handleSubmit}>

          {
            !isLogin && (

              <input
                type="text"
                name="name"
                placeholder="Name"
                onChange={handleChange}
                style={inputStyle}
              />
            )
          }

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
            {
              isLogin
              ? 'Login'
              : 'Signup'
            }
          </button>

        </form>

        <p style={{
          textAlign: 'center',
          color: 'green',
          marginTop: '15px'
        }}>
          {message}
        </p>

        <p
          onClick={() => {
            setIsLogin(!isLogin)
            setMessage('')
          }}
          style={{
            textAlign: 'center',
            color: '#4f46e5',
            cursor: 'pointer',
            fontWeight: 'bold',
            marginTop: '20px'
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

function DashboardCard({ title, value, icon }) {

  return (

    <div style={{
      background: 'white',
      padding: '25px',
      borderRadius: '20px',
      boxShadow: '0 8px 20px rgba(0,0,0,0.08)'
    }}>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>

        <h2 style={{
          color: '#334155'
        }}>
          {title}
        </h2>

        <div style={{
          fontSize: '28px',
          color: '#4f46e5'
        }}>
          {icon}
        </div>

      </div>

      <h1 style={{
        fontSize: '42px',
        color: '#111827'
      }}>
        {value}
      </h1>

    </div>
  )
}

const inputStyle = {
  width: '100%',
  padding: '14px',
  marginBottom: '18px',
  borderRadius: '10px',
  border: '1px solid #cbd5e1',
  fontSize: '15px'
}

const buttonStyle = {
  width: '100%',
  padding: '14px',
  background: '#4f46e5',
  color: 'white',
  border: 'none',
  borderRadius: '10px',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '16px'
}

const adminButtonStyle = {
  padding: '12px 24px',
  background: '#111827',
  color: 'white',
  border: 'none',
  borderRadius: '10px',
  cursor: 'pointer',
  fontWeight: 'bold'
}

export default App
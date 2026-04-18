import React from 'react'
import Header from './Header'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'

function RootLayout() {
  return (
    <div style={styles.container}>
      <Header />
      <main style={styles.content}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh", // this is the spine of the whole layout
  },
  content: {
    flex: 1, // THIS pushes footer down
  },
};
export default RootLayout
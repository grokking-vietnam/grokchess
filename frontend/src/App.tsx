import {
  MDBCol,
  MDBContainer,
  MDBIcon,
  MDBInputGroup,
  MDBRow,
  MDBNavbar,
  MDBNavbarNav,
  MDBNavbarItem,
} from "mdb-react-ui-kit";
import { Fragment } from "react";
import { Outlet, Routes, Route, Link } from "react-router-dom";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />}></Route>
        <Route path="home" element={<Home />}></Route>
        <Route path="grokchess" element={<Grokchess />}></Route>
        <Route path="*" element={<NoMatch />} />
      </Route>
    </Routes>
  );
}

function Layout() {
  return (
    <MDBContainer>
      <MDBNavbar className="my-3" expand="lg" light bgColor="light">
        <MDBContainer fluid>
          <MDBNavbarNav>
            <MDBNavbarItem>
              <Link className="nav-link" to="/home">
                Home
              </Link>
            </MDBNavbarItem>
            <MDBNavbarItem>
              <Link className="nav-link" to="/grokchess">
                Grokchess
              </Link>
            </MDBNavbarItem>
          </MDBNavbarNav>
        </MDBContainer>
      </MDBNavbar>
      <Outlet />
    </MDBContainer>
  );
}
function Home() {
  return (
    <MDBContainer>
      <h2>Welcome to Grokking Lab</h2>
    </MDBContainer>
  );
}
function Grokchess() {
  return (
    <MDBContainer>
      <MDBRow>
        <MDBCol>
          <h1>Grokchess Neo4J Demo</h1>
        </MDBCol>
      </MDBRow>
      <MDBRow>
        <MDBCol>
          <form>
            <MDBInputGroup
              noBorder
              size="lg"
              textBefore={
                <Fragment>
                  <MDBIcon fas icon="chess-king" size="2x" />
                  <MDBIcon fas icon="hashtag" size="2x" />
                </Fragment>
              }
            >
              <input
                className="form-control"
                type="text"
                placeholder="Enter lichess username"
              />
            </MDBInputGroup>
          </form>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

function NoMatch() {
  return (
    <MDBContainer>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </MDBContainer>
  );
}
export default App;

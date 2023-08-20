import { useState } from "react";
import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarNav,
  MDBNavbarItem,
} from "mdb-react-ui-kit";
import { AppShell, Navbar, Text, MediaQuery, Aside, Footer, Header, Burger, Container, useMantineTheme } from '@mantine/core';
import { Outlet, Routes, Route, Link } from "react-router-dom";
import { Grokchess } from "./components/Grokchess";

function App() {
  return <AppShellDemo />;
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

function AppShellDemo() {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  return <AppShell styles={{
    main: {
      background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
    },
  }}
    navbarOffsetBreakpoint="sm"
    asideOffsetBreakpoint="sm"
    navbar={
      <Navbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: 300 }}>
        <Text>Application navbar</Text>
      </Navbar>
    }
    aside={
      <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
        <Aside p="md" hiddenBreakpoint="sm" width={{ sm: 200, lg: 300 }}>
          <Text>Application sidebar</Text>
        </Aside>
      </MediaQuery>
    }
    footer={
      <Footer height={60} p="md">
        Application footer
      </Footer>
    }
    header={
      <Header height={{ base: 50, md: 70 }} p="md">
        <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
            <Burger
              opened={opened}
              onClick={() => setOpened((o) => !o)}
              size="sm"
              color={theme.colors.gray[6]}
              mr="xl"
            />
          </MediaQuery>

          <Text>Application header</Text>
        </div>
      </Header>
    }
  >
    <Text>Resize app to see responsive navbar in action</Text>
  </AppShell>
}
function Home() {
  return (
    <Container>
      <h2>Welcome to Grokking Lab</h2>
    </Container>
  );
}

function NoMatch() {
  return (
    <Container>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </Container>
  );
}
export default App;

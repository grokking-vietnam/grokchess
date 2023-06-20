import {
  MDBBtn,
  MDBCol,
  MDBContainer,
  MDBIcon,
  MDBInput,
  MDBInputGroup,
  MDBRow,
  MDBCheckbox
} from 'mdb-react-ui-kit';
import { Fragment } from 'react';

function App() {
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
              size='lg'
              textBefore={
                <Fragment>
                  <MDBIcon fas icon='chess-king' size='2x' />
                  <MDBIcon fas icon='hashtag' size='2x' />
                </Fragment>
              }
            >
              <input
                className='form-control'
                type='text'
                placeholder='Enter lichess username'
              />
            </MDBInputGroup>
          </form>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default App;
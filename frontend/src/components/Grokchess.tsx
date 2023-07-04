import {
  MDBCol,
  MDBContainer,
  MDBIcon,
  MDBInputGroup,
  MDBRow,
  MDBSpinner,
} from 'mdb-react-ui-kit';
import { Fragment, useState } from 'react';

type Games = [
  {
    name: string;
  },
  {
    name: string;
  }
];
export function Grokchess() {
  const [isLoading, setLoading] = useState(false);
  const [games, setGames] = useState([]);
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const apiUrl = process.env.API_URL!;
    setLoading(true);
    fetch(`${apiUrl}/games`, {
      method: form.method,
      body: formData,
    })
      .then((res) => res.json())
      .then((res) => {
        setGames(
          res.map((game: Games) => {
            return (
              <p>
                Game 1: {game[0].name}, Game 2: {game[1].name}
              </p>
            );
          })
        );
      })
      .catch(console.error)
      .finally(() => {
        setLoading(false);
      });
  }
  return (
    <MDBContainer>
      <MDBRow>
        <MDBCol>
          <h1>Grokchess Neo4J Demo</h1>
        </MDBCol>
      </MDBRow>
      <MDBRow>
        <MDBCol>
          <form method='post' onSubmit={handleSubmit}>
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
                name='username'
                placeholder='Enter lichess username'
              />
            </MDBInputGroup>
          </form>
        </MDBCol>
      </MDBRow>
      <MDBRow>
        <MDBCol>
          <div className='my-5'>
            {isLoading ? (
              <div className='d-flex justify-content-center'>
                <MDBSpinner
                  color='primary'
                  style={{ width: '5rem', height: '5rem' }}
                >
                  <span className='visually-hidden'>Loading...</span>
                </MDBSpinner>
              </div>
            ) : (
              games
            )}
          </div>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

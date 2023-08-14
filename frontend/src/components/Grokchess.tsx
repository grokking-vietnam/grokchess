import {
  MDBCol,
  MDBContainer,
  MDBIcon,
  MDBInputGroup,
  MDBListGroup,
  MDBListGroupItem,
  MDBRow,
  MDBSpinner,
} from 'mdb-react-ui-kit';
import { Fragment, useState } from 'react';
type Relationship = {
  start: string;
  end: string;
  type: string;
  id: string;
};
type Path = Relationship[];

export function Grokchess() {
  const [isLoading, setLoading] = useState(false);
  const [paths, setPaths] = useState([]);
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const apiUrl = process.env.API_URL!;
    setLoading(true);
    fetch(`${apiUrl}/path`, {
      method: form.method,
      body: formData,
    })
      .then((res) => res.json())
      .then((res) => {
        setPaths(
          res.map((path: Path, i: number) => {
            return (
              <MDBListGroupItem key={i} noBorders color='primary' className='px-3 mb-2 rounded-3'>
                <b>Path: #{i + 1}</b>
                {path.map((rel: Relationship) => {
                  return <p key={rel.id}>{rel.start} {rel.type} {rel.end}</p>;
                })}
              </MDBListGroupItem>
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
                placeholder='Enter lichess username: #username1, #username2'
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
              <MDBListGroup>
                {paths}
              </MDBListGroup>
            )}
          </div>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

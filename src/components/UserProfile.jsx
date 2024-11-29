import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, logoutUser } from "../redux/actions/authActions";

const UserProfile = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [edit, setEdit] = useState(false);
  const [data, setData] = useState({
    nome: user.nome,
    cognome: user.cognome,
    email: user.email,
  });

  const handleChange = (e) => {
    const { name, value } = e.targhet;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = () => {
    dispatch(loginUser(data));
    setEdit(false);
  };
  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <div className="backgroundUserProodile">
      <div>
        <h1>Profilo Utente</h1>
        {edit ? (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="nome"
              value={data.nome}
              onChange={handleChange}
            />

            <input
              type="text"
              name="cognome"
              value={data.cognome}
              onChange={handleChange}
            />
            <input
              type="email"
              name="email"
              value={data.email}
              onChange={handleChange}
            />
            <button type="submit">Salva</button>
          </form>
        ) : (
          <div>
            <p>Nome: {user.nome}</p>
            <p>Cognome: {user.cognome}</p>
            <p>Email: {user.email}</p>
            <button onClick={() => setEdit(true)}>Modifica</button>
          </div>
        )}
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default UserProfile;

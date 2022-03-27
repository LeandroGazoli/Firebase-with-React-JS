import firebase from "./firebaseConnection";
import { useState, useEffect } from "react";
import "./style.css";
function App() {
  const [idPost, setIdPost] = useState([]);
  const [titulo, setTitulo] = useState([]);
  const [autor, setAutor] = useState([]);
  const [post, setPost] = useState([]);
  const [email, setEmail] = useState([]);
  const [senha, setSenha] = useState([]);
  const [user, setUser] = useState(false);
  const [userLogged, setUserLogged] = useState({});

  const [cargo, setCargo] = useState([]);
  const [nome, setNome] = useState([]);

  useEffect(() => {
    async function loadPosts() {
      await firebase
        .firestore()
        .collection("posts")
        .onSnapshot((doc) => {
          let meusPosts = [];

          doc.forEach((item) => {
            meusPosts.push({
              id: item.id,
              titulo: item.data().titulo,
              autor: item.data().autor,
            });
          });

          setPost(meusPosts);
        });
    }

    loadPosts();
  }, []);

  useEffect(() => {
    async function checkLogin() {
      await firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          setUser(true);
          setUserLogged({
            uid: user.uid,
            email: user.email,
          });
        } else {
          setUser(false);
          setUserLogged({});
        }
      });
    }

    checkLogin();
  }, []);

  async function handleAdd() {
    await firebase
      .firestore()
      .collection("posts")
      .add({
        titulo: titulo,
        autor: autor,
      })
      .then(() => {
        console.log("dados cadastrados com sucesso");
        setTitulo("");
        setAutor("");
      })
      .catch((error) => {
        console.log("Gerou algum erro" + error);
      });
  }

  async function buscarPost() {
    /*await firebase
      .firestore()
      .collection("posts")
      .doc("1")
      .get()
      .then((snapshot) => {
        setTitulo(snapshot.data().titulo);
        setAutor(snapshot.data().autor);
      });*/

    await firebase
      .firestore()
      .collection("posts")
      .get()
      .then((snapshot) => {
        let lista = [];

        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor,
          });
        });
        setPost(lista);
      });
  }

  async function editarPost() {
    await firebase
      .firestore()
      .collection("posts")
      .doc(idPost)
      .update({
        titulo: titulo,
        autor: autor,
      })
      .then(() => {
        setIdPost("");
        setAutor("");
        setTitulo("");
      });
  }

  async function excluirPost(id) {
    await firebase
      .firestore()
      .collection("posts")
      .doc(id)
      .delete()
      .then(() => {
        alert("Postagem deletada");
      });
  }

  async function novoUsuario() {
    await firebase
      .auth()
      .createUserWithEmailAndPassword(email, senha)
      .then(async (value) => {
        await firebase
          .firestore()
          .collection("users")
          .doc(value.user.uid)
          .set({ nome: nome, cargo: cargo })
          .then(() => {
            setNome("");
            setCargo("");
            setEmail("");
            setSenha("");
          });
      })
      .catch((error) => {
        if (error.code === "auth/weak-password") {
          alert("Senha muito fraca..");
        } else if (error.code === "auth/email-already-in-use") {
          alert("Esse email já existe!");
        }
      });
  }

  async function logout() {
    await firebase.auth().signOut();
  }

  async function fazerLogin() {
    await firebase
      .auth()
      .signInWithEmailAndPassword(email, senha)
      .then((value) => {
        console.log();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div className="App">
      <h1>Firebase</h1>
      {user && (
        <div>
          <strong>Seja bem vindo!</strong>
          <span>
            {userLogged.uid} - {userLogged.email}
          </span>
          <br />
          <br />
        </div>
      )}
      <div className="container">
        <label htmlFor="">Nome</label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <br />

        <label htmlFor="">Cargo</label>
        <input
          type="text"
          value={cargo}
          onChange={(e) => setCargo(e.target.value)}
        />
        <br />

        <label htmlFor="">Email</label>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <label htmlFor="">Senha</label>
        <input
          type="text"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        <br />
        <button onClick={novoUsuario}>Cadastrar</button>
        <button onClick={fazerLogin}>Login</button>
        <button onClick={logout}>Sair</button>
        <br />
      </div>
      <br />
      <hr />
      <div className="container">
        <h2>Banco de dados</h2>
        <label htmlFor="">ID:</label>
        <input
          type="text"
          value={idPost}
          onChange={(e) => setIdPost(e.target.value)}
        />

        <label htmlFor="">Titulo</label>
        <textarea
          name=""
          id=""
          cols="30"
          rows="10"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        ></textarea>

        <label htmlFor="">Autor</label>
        <input
          type="text"
          value={autor}
          onChange={(e) => setAutor(e.target.value)}
        />

        <button onClick={handleAdd}>Cadastrar</button>
        <button onClick={buscarPost}>Buscar post</button>
        <button onClick={editarPost}>Editar</button>

        <br />
        <ul>
          {post.map((item) => {
            return (
              <li key={item.id}>
                <span>
                  ID: {item.id} <br />
                </span>
                <span>Titulo: {item.titulo}</span> <br />
                <span>Autor: {item.autor}</span> <br />
                <button onClick={() => excluirPost(item.id)}>
                  Excluir post
                </button>
                <br />
                <br />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default App;

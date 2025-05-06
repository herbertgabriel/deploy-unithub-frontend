import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./RecuperarSenha.css";

function RecuperarSenha() {
    return (
        <>
            <Header />

            <main className="recuperar-container">
                <div className="recuperar-card">
                    <h2>Recuperar Senha</h2>
                    <form className="recuperar-form">
                        <label htmlFor="novaSenha">Senha</label>
                        <input
                            type="password"
                            id="novaSenha"
                            placeholder="Nova senha"
                        />
                        <input
                            type="password"
                            id="confirmaSenha"
                            placeholder="Confirme a senha"
                        />

                        <div className="botoes">
                            <button type="submit" className="btn-salvar">Salvar</button>
                            <button type="button" className="btn-cancelar">Cancelar</button>
                        </div>
                    </form>
                </div>
            </main>

            <Footer />
        </>
    );
}

export default RecuperarSenha;

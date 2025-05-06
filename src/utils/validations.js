// Sanitiza a entrada para evitar injeção de código
const sanitizeInput = (input) => {
    const div = document.createElement("div");
    div.innerText = input;
    return div.innerHTML;
  };

  const validateName = (name) => {
    const nameRegex = /^[a-zA-ZÀ-ÿ\s]{2,}$/; // Aceita letras, espaços e caracteres acentuados, com pelo menos 2 caracteres
    return nameRegex.test(name);
  };

  const validateTelephone = (telephone) => {
    const telephoneRegex = /^[0-9]{10,11}$/; // Aceita apenas números com 10 ou 11 dígitos
    return telephoneRegex.test(telephone);
  };
  
  // Valida se o email está no formato correto
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  // Valida se a senha atende aos critérios mínimos
  const validatePassword = (password) => {
    return password.length >= 6; // Exemplo: senha deve ter pelo menos 6 caracteres
  };
  
  // Valida os campos do formulário de login
  const validateLoginForm = (email, password) => {
    if (!validateEmail(email)) {
      return "Por favor, insira um email válido.";
    }
    if (!validatePassword(password)) {
      return "A senha deve ter pelo menos 6 caracteres.";
    }
    return null;
  };
  
  // Valida os campos do formulário de cadastro
  const validateRegisterForm = (nome, email, password, confirmPassword, courseId, telephone) => {
    if (!validateName(nome)) {
        return "Por favor, insira um nome válido (apenas letras e espaços, com pelo menos 2 caracteres).";
      }
    if (!validateEmail(email)) {
      return "Por favor, insira um email válido.";
    }
    if (!validatePassword(password)) {
      return "A senha deve ter pelo menos 6 caracteres.";
    }
    if (password !== confirmPassword) {
      return "As senhas não coincidem.";
    }
    if (!courseId) {
      return "Por favor, selecione um curso.";
    }
    if (!validateTelephone(telephone)) {
      return "Por favor, insira um telefone válido com 10 ou 11 dígitos.";
    }
    return null;
  };
  
  // Valida o formulário de recuperação de senha
  const validateRecoverPasswordForm = (email) => {
    if (!validateEmail(email)) {
      return "Por favor, insira um email válido.";
    }
    return null;
  };
  
  export {
    sanitizeInput,
    validateName,
    validateTelephone, 
    validateEmail,
    validatePassword,
    validateLoginForm,
    validateRegisterForm,
    validateRecoverPasswordForm,
  };
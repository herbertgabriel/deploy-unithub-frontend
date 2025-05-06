const httpStatusMessages = {
    200: "OK - A solicitação foi bem-sucedida.",
    201: "Criado - O recurso foi criado com sucesso.",
    204: "Sem Conteúdo - A solicitação foi bem-sucedida, mas não há conteúdo para retornar.",
    400: "Requisição Inválida - A solicitação não pode ser processada devido a erros do cliente.",
    401: "Não Autorizado - Você precisa estar autenticado para acessar este recurso.",
    403: "Proibido - Você não tem permissão para acessar este recurso.",
    404: "Não Encontrado - O recurso solicitado não foi encontrado.",
    409: "Conflito - Já existe um recurso com os mesmos dados.",
    500: "Erro Interno do Servidor - Ocorreu um erro no servidor.",
    502: "Bad Gateway - O servidor recebeu uma resposta inválida ao tentar processar a solicitação.",
    503: "Serviço Indisponível - O servidor está temporariamente indisponível.",
    504: "Gateway Timeout - O servidor demorou muito para responder.",
  };
  
  const httpStatusMessagesLogin = {
    200: "Login bem-sucedido.",
    201: "Sua conta foi criada com sucesso.",
    400: "Senhas diferentes no cadastro.",
    401: "Email ou senha incorretos.",
    403: "Email ou senha incorretos.",
    404: "Curso não encontrado.",
    409: "Email já cadastrado.",
    422: "Email já cadastrado.",
    500: "Role padrão 'ALUNO' não registrada.",
    503: "Serviço Indisponível - O servidor está temporariamente indisponível.",
    504: "Gateway Timeout - O servidor demorou muito para responder.",
  };
  
  export default httpStatusMessages; // Exportação padrão
  export { httpStatusMessagesLogin }; // Exportação nomeada
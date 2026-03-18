-- Remover eventos de teste
DELETE FROM eventos WHERE nome LIKE 'Teste%';
-- Remover usuários de teste
DELETE FROM usuarios WHERE email LIKE 'teste%';

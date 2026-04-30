-- Category
insert into tb_category (name) values ('Aventura');
insert into tb_category (name) values ('Romance');
insert into tb_category (name) values ('Ficção');
insert into tb_category (name) values ('Policial');
insert into tb_category (name) values ('Biografia');
-- book
insert into tb_book (name, author, description, price, imageURL, category_id)values ('O Senhor dos Anéis - A Sociedade do Anel', 'J.R.R. Tolkien', 'Uma jornada épica através da Terra Média para destruir um anel poderoso.', 49.90, 'https://m.media-amazon.com/images/I/81hCVEC0ExL.jpg', 1);
insert into tb_book (name, author, description, price, imageURL, category_id)values ('As Aventuras de Huckleberry Finn', 'Mark Twain', 'As peripécias de um menino que foge de casa e navega pelo rio Mississippi.', 39.90, 'https://m.media-amazon.com/images/I/91AW1FPXtEL._AC_UF1000,1000_QL80_.jpg', 1);
insert into tb_book (name, author, description, price, imageURL, category_id)values ('Orgulho e Preconceito', 'Jane Austen', 'O clássico romance entre Elizabeth Bennet e o Sr. Darcy na Inglaterra do século XIX.', 45.90, 'https://m.media-amazon.com/images/I/719esIW3D7L._AC_UF1000,1000_QL80_.jpg', 2);
insert into tb_book (name, author, description, price, imageURL, category_id)values ('O Morro dos Ventos Uivantes', 'Emily Brontë', 'Uma intensa história de amor e vingança entre Catherine e Heathcliff.', 42.90, 'https://m.media-amazon.com/images/I/71lqmkoeosL._AC_UF1000,1000_QL80_.jpg', 2);
insert into tb_book (name, author, description, price, imageURL, category_id)values ('Fundação', 'Isaac Asimov', 'O império galáctico está em decadência e um psicohistoriador tenta salvar o conhecimento da humanidade.', 54.90, 'https://m.media-amazon.com/images/I/712vJIziMgL.jpg', 3);
insert into tb_book (name, author, description, price, imageURL, category_id)values ('Neuromancer', 'William Gibson', 'Um hacker é contratado para um último grande golpe no ciberespaço.', 47.90, 'https://m.media-amazon.com/images/I/91Bx5ilP+EL.jpg', 3);
insert into tb_book (name, author, description, price, imageURL, category_id)values ('O Assassinato no Expresso do Oriente', 'Agatha Christie', 'O detetive Hercule Poirot investiga um assassinato a bordo de um trem luxuoso.', 44.90, 'https://m.media-amazon.com/images/I/81Zp6MFxIDL.jpg', 4);
insert into tb_book (name, author, description, price, imageURL, category_id)values ('O Código Da Vinci', 'Dan Brown', 'O simbologista Robert Langdon investiga um assassinato no Louvre que o leva a uma descoberta surpreendente.', 48.90, 'https://m.media-amazon.com/images/I/71marwX+lyL._UF1000,1000_QL80_.jpg', 4);
insert into tb_book (name, author, description, price, imageURL, category_id)values ('Steve Jobs - A Biografia', 'Walter Isaacson', 'A biografia autorizada do co-fundador da Apple, baseada em mais de 40 entrevistas.', 59.90, 'https://m.media-amazon.com/images/I/51rVYANstPL._AC_UF1000,1000_QL80_.jpg', 5);
insert into tb_book (name, author, description, price, imageURL, category_id)values ('Nelson Mandela - Longa Caminhada até a Liberdade', 'Nelson Mandela', 'A autobiografia do líder sul-africano que passou 27 anos na prisão e se tornou o primeiro presidente negro da África do Sul.', 64.90, 'https://m.media-amazon.com/images/I/61fNcPM8LcL._AC_UF1000,1000_QL80_.jpg', 5);
-- User - password: 123
INSERT INTO tb_user(display_name, username, password) VALUES ('Administrador', 'admin','$2a$10$.PVIfB07x.SfMYTcToxL0.yxcLWU0GbS2NUO1W1QAvqMm/TsFhVem');
INSERT INTO tb_user(display_name, username, password) VALUES ('Teste', 'test','$2a$10$.PVIfB07x.SfMYTcToxL0.yxcLWU0GbS2NUO1W1QAvqMm/TsFhVem');
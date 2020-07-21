var tbody = document.querySelector('table tbody');
var aluno;

function Cadastrar() {
	if (aluno === undefined || aluno == null) {
		aluno = {};
	}
	aluno.Nome = document.querySelector('#nome').value;
	aluno.Sobrenome = document.querySelector('#sobrenome').value;
	aluno.Telefone = document.querySelector('#telefone').value;
	aluno.RA = document.querySelector('#ra').value;

	if (aluno.Id === undefined || aluno.Id === 0) {
		salvarEstudante('POST', 0, aluno);
	} else {
		salvarEstudante('PUT', aluno.Id, aluno);
		aluno = null;
	}
	carregaEstudantes();
	Cancelar();
	$('#myModal').modal('hide');
}

function Cancelar() {
	var myModalLabel = document.querySelector('#myModalLabel');
	var btnSalvar = document.querySelector('#btnSalvar');
	var btnCancelar = document.querySelector('#btnCancelar');

	myModalLabel.textContent = 'Cadastrar Aluno'
	btnSalvar.textContent = 'Cadastrar';
	btnCancelar.textContent = 'Limpar';

	document.querySelector('#nome').value = '';
	document.querySelector('#sobrenome').value = '';
	document.querySelector('#telefone').value = '';
	document.querySelector('#ra').value = '';

	aluno = {};
	$('#myModal').modal('hide');
}

function carregaEstudantes() {
	tbody.innerHTML = '';
	var xhr = new XMLHttpRequest();
	
	xhr.open('GET', `http://localhost:51441/api/Aluno/`, true);

	xhr.onload = function () {
		var estudantes = JSON.parse(this.responseText);
		for (var indice in estudantes) {
			adicionaLinha(estudantes[indice]);
		}
	}
	xhr.send();

}

function salvarEstudante(metodoHTTP, id, corpo) {
	var xhr = new XMLHttpRequest();
	if (id === undefined || id === 0) {
		id = '';
	}
	
	xhr.open(metodoHTTP, `http://localhost:51441/api/Aluno/${id}`, false);

	xhr.setRequestHeader('content-type', 'application/json');
	xhr.send(JSON.stringify(corpo));
}

carregaEstudantes('GET');

function editarEstudante(estudante) {

	var myModalLabel = document.querySelector('#myModalLabel');
	var btnSalvar = document.querySelector('#btnSalvar');
	var btnCancelar = document.querySelector('#btnCancelar');

	myModalLabel.textContent = `Editar Aluno ${estudante.Nome}`;
	btnSalvar.textContent = 'Salvar';
	btnCancelar.textContent = 'Cancelar';

	document.querySelector('#nome').value = estudante.Nome;
	document.querySelector('#sobrenome').value = estudante.Sobrenome;
	document.querySelector('#telefone').value = estudante.Telefone;
	document.querySelector('#ra').value = estudante.RA;

	aluno = estudante;

}

function excluirEstudante(id) {
	var xhr = new XMLHttpRequest();
	xhr.open('DELETE', `http://localhost:51441/api/Aluno/${id}`, false);
	xhr.send();
}

function excluir(id) {
	excluirEstudante(id);
	carregaEstudantes();
}

function adicionaLinha(estudante) {

	var trow = `<tr>
	<td>${estudante.Nome}</td>
	<td>${estudante.Sobrenome}</td>
	<td>${estudante.Telefone}</td>
	<td>${estudante.RA}</td>
	<td>
	<button class='btn btn-info' data-toggle="modal" data-target="#myModal" onClick='editarEstudante(${JSON.stringify(estudante)})'>Editar</button>
	<button class='btn btn-danger' data-toggle="modal" data-target="#myModal" onClick='excluirEstudante(${estudante.Id})'>Excluir</button>
	</td>
	</tr>
	`
	tbody.innerHTML += trow;
}
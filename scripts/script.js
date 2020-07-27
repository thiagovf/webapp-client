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

function NovoAluno() {
	var myModalLabel = document.querySelector('#myModalLabel');
	var btnSalvar = document.querySelector('#btnSalvar');

	myModalLabel.textContent = 'Cadastrar Aluno'
	btnSalvar.textContent = 'Cadastrar';

	document.querySelector('#nome').value = '';
	document.querySelector('#sobrenome').value = '';
	document.querySelector('#telefone').value = '';
	document.querySelector('#ra').value = '';

	aluno = {};
	$('#myModal').modal('show');
}

function Cancelar() {
	var myModalLabel = document.querySelector('#myModalLabel');
	var btnSalvar = document.querySelector('#btnSalvar');

	myModalLabel.textContent = 'Cadastrar Aluno'
	btnSalvar.textContent = 'Cadastrar';

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

	xhr.open('GET', `http://localhost:51441/api/Aluno/Recuperar`, true);

	xhr.onerror = function () {
		console.log('ERROR', xhr.readyState);
	}

	xhr.onreadystatechange = function () {
		if (this.readyState == 4) {
			if (this.status == 200) {
				var estudantes = JSON.parse(this.responseText);
				for (var indice in estudantes) {
					adicionaLinha(estudantes[indice]);
				}
			} else if (this.status == 500) {
				var erro = JSON.parse(this.responseText);
				console.log(erro);
			}
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

	myModalLabel.textContent = `Editar Aluno ${estudante.nome}`;
	btnSalvar.textContent = 'Salvar';

	document.querySelector('#nome').value = estudante.nome;
	document.querySelector('#sobrenome').value = estudante.sobrenome;
	document.querySelector('#telefone').value = estudante.telefone;
	document.querySelector('#ra').value = estudante.ra;

	aluno = estudante;

}

function excluirEstudante(id) {
	var xhr = new XMLHttpRequest();
	xhr.open('DELETE', `http://localhost:51441/api/Aluno/${id}`, false);
	xhr.send();
}

function excluir(estudante) {
	bootbox.confirm({
	    message: `Tem certeza que deseja excluir o estudante ${estudante.Nome}?`,
	    buttons: {
	        confirm: {
	            label: 'Sim',
	            className: 'btn-success'
	        },
	        cancel: {
	            label: 'Não',
	            className: 'btn-danger'
	        }
	    },
	    callback: function (result) {
	       	if(result) {
				excluirEstudante(estudante.Id);
				carregaEstudantes();
			}
	    }
	});

}

function adicionaLinha(estudante) {

	var trow = `<tr>
	<td>${estudante.nome}</td>
	<td>${estudante.sobrenome}</td>
	<td>${estudante.telefone}</td>
	<td>${estudante.ra}</td>
	<td>
	<button class='btn btn-info' data-toggle="modal" data-target="#myModal" onClick='editarEstudante(${JSON.stringify(estudante)})'>Editar</button>
	<button class='btn btn-danger' onClick='excluir(${JSON.stringify(estudante)})'>Excluir</button>
	</td>
	</tr>
	`
	tbody.innerHTML += trow;
}
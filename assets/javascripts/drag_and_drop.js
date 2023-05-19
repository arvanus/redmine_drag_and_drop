$(function() {
  $(".draggable, .issue").draggable({
    revert: "invalid",
    containment: "document",
    helper: "clone",
    start: function(ev, ui) {
    }
  });

  $(".droppable, .issue").droppable({
    accept: ".draggable, .issue",
    drop: function(event, ui) {
      var draggableTask = ui.draggable;
      var droppedOnTask = $(this);
//asdasdasdasd
      // Obtenha o ID das tarefas
      var draggableTaskId = draggableTask.attr("data-task-id");
      var droppedOnTaskId = droppedOnTask.attr("data-task-id");
      if (draggableTaskId === undefined ) {
        draggableTaskId = draggableTask.find('.checkbox input[name="ids[]"]').val();
      }
      if (droppedOnTaskId === undefined ) {
        droppedOnTaskId = droppedOnTask.find('.checkbox input[name="ids[]"]').val();
      }
      // Realize a lógica de atualização do parent da tarefa arrastada
      // para ser a tarefa sombreada (droppedOnTask)
      // Use as variáveis draggableTaskId e droppedOnTaskId para atualizar os relacionamentos

      // Exemplo de chamada AJAX para atualizar o parent da tarefa
      //updateParent(draggableTaskId,droppedOnTaskId);
      issueId=draggableTaskId;
      targetId=droppedOnTaskId;
      showActionOptions(function(action) {
      if (action === 'updateParent') {
        // Opção: Atualizar o pai
        updateParent(issueId, targetId);
      } else if (action === 'addSuccessor') {
        // Opção: Adicionar como sucessor
        addSuccessor(issueId, targetId);
      } else if (action === 'addReference') {
        // Opção: Adicionar como referência
        addReference(issueId, targetId);
      }
    }, event);
    }
  });
});

function showActionOptions(callback, event) {
  // Crie o elemento de menu
  var menudiv = $('<div id="context-menu" class="reverse-y" >');
  var menu = $('<ul>');
  var options = {
    updateParent: 'Atualizar o pai',
    addSuccessor: 'Adicionar como sucessor',
    addReference: 'Adicionar como referência'
  };

  // Adicione as opções de menu ao elemento
  $.each(options, function(key, value) {
    var menuItem = $('<li>').text(value);

    menuItem.on('click', function() {
      callback(key);
      menudiv.remove();
    });

    menu.append(menuItem);
  });

  // Posicione o menu próximo ao cursor do mouse
    menudiv.css({
      top: event.pageY + 'px',
      left: event.pageX + 'px'
    });
  menudiv.append(menu);
  // Adicione o menu ao corpo do documento
  $('body').append(menudiv);
}


function updateParent(issueId, targetId) {
  // Lógica para atualizar o pai da tarefa arrastada
      $.ajax({
        url: "/tasks/" + issueId + "/update_parent",
        type: "PUT",
        data: { parent_id: targetId },
        success: function(response) {
          // Atualização bem-sucedida
          // Dee ter opção melhor que dar um reload geral
          location.reload();
        },
        error: function(xhr, status, error) {
          // Lidar com erros
        }
      });

}

function addSuccessor(issueId, targetId) {
  // Lógica para adicionar a tarefa arrastada como sucessora da tarefa alvo
      $.ajax({
        url: "/issues/" + issueId + "/relations",
        type: "POST",
        data: { relation: {"relation_type":"follows", "issue_to_id": targetId, "delay":"1"} },
        success: function(response) {
          // Atualização bem-sucedida
          // Deve ter opção melhor que dar um reload geral
          location.reload();
        },
        error: function(xhr, status, error) {
          // Lidar com erros
        }
      });

}

function addReference(issueId, targetId) {
  // Lógica para adicionar a tarefa arrastada como referência da tarefa alvo
      $.ajax({
        url: "/issues/" + issueId + "/relations",
        type: "POST",
        data: { relation: {"relation_type":"relates", "issue_to_id": targetId, "delay":""} },
        success: function(response) {
          // Atualização bem-sucedida
          // Deve ter opção melhor que dar um reload geral
          location.reload();
        },
        error: function(xhr, status, error) {
          // Lidar com erros
        }
      });

}

$(function() {
  $(".draggable, tr.issue, .gantt_subjects .issue-subject").draggable({
    revert: "invalid",
    containment: "document",
    helper: "clone",
    start: function(ev, ui) {
    }
  });

  $(".droppable, tr.issue, .gantt_subjects .issue-subject").droppable({
    accept: ".draggable, .issue,  .gantt_subjects .issue-subject",
    drop: function(event, ui) {
      var draggableTask = ui.draggable;
      var droppedOnTask = $(this);
      // Obtenha o ID das tarefas
      //Meu componente custom
      var draggableTaskId = draggableTask.attr("data-task-id");
      var droppedOnTaskId = droppedOnTask.attr("data-task-id");
      //aba das issues
      if (draggableTaskId === undefined ) {
        draggableTaskId = draggableTask.find('.checkbox input[name="ids[]"]').val();
      }
      if (droppedOnTaskId === undefined ) {
        droppedOnTaskId = droppedOnTask.find('.checkbox input[name="ids[]"]').val();
      }
      //Aba do gantt
      if (draggableTaskId === undefined ) {
        draggableTaskId = draggableTask.attr("id").split("-").pop();
      }
      if (droppedOnTaskId === undefined ) {
        droppedOnTaskId = droppedOnTask.attr("id").split("-").pop();
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
  // Remove any existing context menu
  $('#drag-drop-context-menu').remove();

  // Get translations from backend (CSP compliant) or fallback to English
  var t;
  var translationsEl = document.getElementById('drag-and-drop-translations');
  if (translationsEl && translationsEl.dataset.translations) {
    try {
      t = JSON.parse(translationsEl.dataset.translations);
    } catch(e) {
      console.error('Failed to parse drag and drop translations:', e);
      t = null;
    }
  }

  // Fallback to English if translations not available
  if (!t) {
    t = {
      updateParent: 'Update parent to',
      addSuccessor: 'Add as successor',
      addReference: 'Add as reference',
      cancel: 'Cancel'
    };
  }

  // Create menu using Redmine's context menu structure
  var menudiv = $('<div id="drag-drop-context-menu">');
  var menu = $('<ul>');

  var options = [
    { key: 'updateParent', text: t.updateParent, icon: 'icon-link' },
    { key: 'addSuccessor', text: t.addSuccessor, icon: 'icon-arrow-right' },
    { key: 'addReference', text: t.addReference, icon: 'icon-link-break' },
    { key: 'cancelar', text: t.cancel, icon: 'icon-cancel' }
  ];

  // Build menu items with Redmine-style structure
  $.each(options, function(index, option) {
    var menuItem = $('<li>');
    var menuLink = $('<a href="#">')
      .addClass(option.icon)
      .text(option.text);

    menuLink.on('click', function(e) {
      e.preventDefault();
      callback(option.key);
      menudiv.remove();
    });

    menuItem.append(menuLink);
    menu.append(menuItem);
  });

  menudiv.append(menu);

  // Position menu at cursor location
  var menuX = event.pageX;
  var menuY = event.pageY;

  // Adjust position to keep menu within viewport (Redmine-style)
  var $window = $(window);
  var windowWidth = $window.width();
  var windowHeight = $window.height();
  var scrollLeft = $window.scrollLeft();
  var scrollTop = $window.scrollTop();

  menudiv.css({
    position: 'absolute',
    top: menuY + 'px',
    left: menuX + 'px',
    display: 'block'
  });

  // Append to content div (Redmine standard)
  var $content = $('#content');
  if ($content.length) {
    $content.append(menudiv);
  } else {
    $('body').append(menudiv);
  }

  // Adjust position if menu goes off-screen (reverse-x, reverse-y classes)
  var menuWidth = menudiv.outerWidth();
  var menuHeight = menudiv.outerHeight();

  if (menuX + menuWidth > scrollLeft + windowWidth) {
    menudiv.css('left', (menuX - menuWidth) + 'px').addClass('reverse-x');
  }
  if (menuY + menuHeight > scrollTop + windowHeight) {
    menudiv.css('top', (menuY - menuHeight) + 'px').addClass('reverse-y');
  }

  // Close menu on outside click
  var outsideMenuClick = function(e) {
    var target = $(e.target);
    if (!target.closest('#drag-drop-context-menu').length) {
      menudiv.remove();
      $(document).off('click', outsideMenuClick);
    }
  };

  // Small delay to prevent immediate closure
  setTimeout(function() {
    $(document).on('click', outsideMenuClick);
  }, 100);
}


function updateParent(issueId, targetId) {
  // Lógica para atualizar o pai da tarefa arrastada
      $.ajax({
        url: "/issues/" + issueId + "/update_parent",
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

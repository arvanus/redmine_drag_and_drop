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
      var draggableIssue = ui.draggable;
      var droppedOnIssue = $(this);

      // Obtenha o ID das tarefas
      var draggableIssueId = draggableIssue.attr("data-issue-id");
      var droppedOnIssueId = droppedOnIssue.attr("data-issue-id");
      if (draggableIssueId === undefined ) {
        draggableIssueId = draggableIssue.find('.checkbox input[name="ids[]"]').val();
      }
      if (droppedOnIssueId === undefined ) {
        droppedOnIssueId = droppedOnIssue.find('.checkbox input[name="ids[]"]').val();
      } 
      // Realize a lógica de atualização do parent da tarefa arrastada
      // para ser a tarefa sombreada (droppedOnIssue)
      // Use as variáveis draggableIssueId e droppedOnIssueId para atualizar os relacionamentos

      // Exemplo de chamada AJAX para atualizar o parent da tarefa
      $.ajax({
        url: "/issues/" + draggableIssueId + "/update_parent",
        type: "PUT",
        data: { parent_id: droppedOnIssueId },
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
  });
});


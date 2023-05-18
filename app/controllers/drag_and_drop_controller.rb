class DragAndDropController < ApplicationController
  def index
    @project = Project.find(params[:id])
    @issues = @project.issues
  end

  def update_parent
    #puts params.inspect
    @issue = Issue.find(params[:id])
    @parent = Issue.find(params[:parent_id])
    if recursive_check(@issue, @parent)
      @issue.parent_id = params[:parent_id]
      @issue.save
      flash[:notice] = l(:notice_successful_update)
    else
      flash[:error] = l(:field_parent_issue) + " " + l('activerecord.errors.messages.invalid')
    end
    head :ok
  end


private

  def recursive_check(issue, parent)
    return false if issue == parent

    current_parent = parent
    while current_parent.parent_id.present?
      return false if current_parent.parent_id == issue.id

      current_parent = Issue.find(current_parent.parent_id)
    end

    true
  end

end


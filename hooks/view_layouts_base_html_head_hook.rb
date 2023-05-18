class DragAndDropViewLayoutsBaseHtmlHeadHook < Redmine::Hook::ViewListener
  def view_layouts_base_html_head(context = {})
    javascript_include_tag('drag_and_drop', plugin: 'drag_and_drop')
  end
end


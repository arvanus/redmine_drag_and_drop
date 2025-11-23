class DragAndDropViewLayoutsBaseHtmlHeadHook < Redmine::Hook::ViewListener
  def view_layouts_base_html_head(context = {})
    translations = {
      updateParent: l(:update_parent, scope: :drag_and_drop),
      addSuccessor: l(:add_successor, scope: :drag_and_drop),
      addReference: l(:add_reference, scope: :drag_and_drop),
      cancel: l(:cancel, scope: :drag_and_drop)
    }.to_json

    javascript_tag("var DragAndDropTranslations = #{translations};") +
    javascript_include_tag('drag_and_drop', plugin: 'drag_and_drop')
  end
end


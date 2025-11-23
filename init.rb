require File.dirname(__FILE__) + '/hooks/view_layouts_base_html_head_hook.rb'
# jquery/ui/rails removed - Redmine 6 includes jQuery UI 1.13.3 by default

Redmine::Plugin.register :redmine_drag_and_drop do
  name 'Drag And Drop plugin'
  author 'Lucas R Schatz'
  description 'This is a plugin for Redmine, allowing the user to drag an issue inside another issue, changing its parent id'
  version '0.1.0'
  url 'https://github.com/arvanus/redmine_drag_and_drop'
  author_url 'https://github.com/arvanus'
end

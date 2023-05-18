require File.dirname(__FILE__) + '/hooks/view_layouts_base_html_head_hook.rb'
require 'jquery/ui/rails'

Redmine::Plugin.register :drag_and_drop do
  name 'Drag And Drop plugin'
  author 'Lucas R Schatz'
  description 'This is a plugin for Redmine, allowing the user to drag an issue inside another issue, changing its parent id'
  version '0.0.1'
  url 'https://github.com/arvanus/redmine_drag_and_drop'
  author_url 'https://github.com/arvanus'
end

ENV['GEM_PATH'] = '/Library/Ruby/Gems/1.8:/Users/brettbukowski/.gem/ruby/1.8:/System/Library/Frameworks/Ruby.framework/Versions/1.8/usr/lib/ruby/gems/1.8'

# Load the rails application
require File.expand_path('../application', __FILE__)

# Initialize the rails application
Downisup::Application.initialize!

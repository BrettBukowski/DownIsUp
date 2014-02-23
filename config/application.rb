require File.expand_path('../boot', __FILE__)

require "action_controller/railtie"
require "active_resource/railtie"
require "rails/test_unit/railtie"
require "sprockets/railtie"

Bundler.require(:default, Rails.env)

module Downisup
  class Application < Rails::Application
    config.assets.enabled = true
  end
end

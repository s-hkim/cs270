require 'test_helper'

class VisualizationControllerTest < ActionDispatch::IntegrationTest
  test "should get main" do
    get visualization_main_url
    assert_response :success
  end

end

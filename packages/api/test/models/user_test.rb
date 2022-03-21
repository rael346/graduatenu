# == Schema Information
#
# Table name: users
#
#  id                     :bigint(8)        not null, primary key
#  academic_year          :integer(4)
#  catalog_year           :integer(4)
#  concentration          :string
#  coop_cycle             :string
#  courses_completed      :json             default([]), is an Array
#  courses_transfer       :json             default([]), is an Array
#  email_bidx             :string
#  email_ciphertext       :text
#  encrypted_password     :string           default(""), not null
#  full_name              :string
#  graduation_year        :integer(4)
#  image_url              :string
#  is_advisor             :boolean          default(FALSE), not null
#  major                  :string
#  nu_id_bidx             :string
#  nu_id_ciphertext       :text
#  remember_created_at    :datetime
#  reset_password_sent_at :datetime
#  reset_password_token   :string
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  primary_plan_id        :bigint(8)
#
# Indexes
#
#  index_users_on_email_bidx            (email_bidx) UNIQUE
#  index_users_on_full_name             (full_name)
#  index_users_on_nu_id_bidx            (nu_id_bidx) UNIQUE
#  index_users_on_reset_password_token  (reset_password_token) UNIQUE
#
require 'test_helper'

class UserTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end

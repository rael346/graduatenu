# == Schema Information
#
# Table name: plan_comments
#
#  id         :bigint(8)        not null, primary key
#  author     :string           not null
#  comment    :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  plan_id    :bigint(8)
#
# Indexes
#
#  index_plan_comments_on_plan_id  (plan_id)
#
class PlanComment < ApplicationRecord
    belongs_to :plan

    # TODO specify that a PlanComment belongs to a user
    # (the user that made that comment) and persist that user's 
    # ID rather than their name.
end

class Approach < ApplicationRecord
    belongs_to :asteroid
    scope :by_orbiting_body, -> body { where(orbiting_body: body) }
    scope :next_approach, Proc.new { |after = DateTime.now.to_date, limit = 1| where('close_approach_date > ?', after).order("close_approach_date ASC").limit(limit) }
end

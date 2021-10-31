class CreateUserWins < ActiveRecord::Migration[6.1]
  def change
    create_table :user_wins do |t|
      t.integer :time
      t.integer :cheering_length
      t.references :user

      t.timestamps
    end

    create_table :user_win_cheerings do |t|
      t.belongs_to :user_win
      t.belongs_to :user_cheering

      t.timestamps
    end
  end
end

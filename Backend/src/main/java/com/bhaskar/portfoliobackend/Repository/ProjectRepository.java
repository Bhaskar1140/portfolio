package com.bhaskar.portfoliobackend.Repository;

import com.bhaskar.portfoliobackend.Model.Project;
import org.springframework.data.mongodb.repository.MongoRepository;


public interface ProjectRepository extends MongoRepository<Project, String> {

}

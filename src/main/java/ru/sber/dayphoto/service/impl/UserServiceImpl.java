package ru.sber.dayphoto.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.sber.dayphoto.model.User;
import ru.sber.dayphoto.repository.UserRepository;
import ru.sber.dayphoto.service.BaseService;
import ru.sber.dayphoto.service.UserService;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public User save(User entity) {
        return userRepository.save(entity);
    }

    @Override
    public boolean delete(long id) {
        return userRepository.delete(id) != 0;
    }

    @Override
    public User get(long id) {
        return userRepository.findById(id).orElse(null);
    }

    @Override
    public List<User> getAll() {
        return userRepository.findAll();
    }
}
